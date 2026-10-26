import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Toasts, useToasts } from "../../components/Requests/Toasts";
import { createAdmin, listAdmins } from "../../services/w3/usersApi";
import type { AdminAccount } from "../../services/w3/userTypes";
import { errorMessage, fmtDate } from "../Requests/format";
import { generatePassword, passwordChecks } from "./password";
import "../Requests/requests.css";
import "../Users/users.css";

// Only existing admins may open this page. Wrap the route in W1's admin guard
// when it lands. The backend must also reject non-admin callers.

type Values = { name: string; email: string; password: string; confirm: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY: Values = { name: "", email: "", password: "", confirm: "" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter the admin's full name.";
  if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!passwordChecks(v.password).every((c) => c.ok)) e.password = "The password does not meet all the rules below.";
  if (v.confirm !== v.password) e.confirm = "The passwords do not match.";
  return e;
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
};

function TextField({ id, label, value, onChange, error, type = "text", autoComplete }: FieldProps) {
  return (
    <div>
      <label className="w3r-field">
        <span>{label}</span>
        <input
          id={id}
          className="w3r-input"
          type={type}
          value={value}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
      {error && (
        <p id={`${id}-error`} className="w3r-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default function NewAdminPage() {
  const { toasts, push } = useToasts();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [attempted, setAttempted] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [admins, setAdmins] = useState<AdminAccount[] | null>(null);
  const [adminsError, setAdminsError] = useState<string | null>(null);

  const loadAdmins = useCallback(async () => {
    try {
      setAdmins(await listAdmins());
      setAdminsError(null);
    } catch (e) {
      setAdminsError(errorMessage(e));
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const errors = attempted ? validate(values) : {};
  const checks = passwordChecks(values.password);
  const set = (key: keyof Values) => (v: string) => setValues((cur) => ({ ...cur, [key]: v }));

  function onGenerate() {
    const pw = generatePassword();
    setValues((cur) => ({ ...cur, password: pw, confirm: pw }));
    setShowPw(true);
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(values.password);
      push("success", "Password copied");
    } catch {
      push("error", "Could not copy. Select the password and copy it by hand.");
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setAttempted(true);
    if (Object.keys(validate(values)).length > 0) {
      setTimeout(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 0);
      return;
    }
    setSubmitting(true);
    try {
      const created = await createAdmin({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      push("success", `Admin created: ${created.email}`);
      // Clear the password from the page as soon as it has been sent.
      setValues(EMPTY);
      setAttempted(false);
      setShowPw(false);
      await loadAdmins();
    } catch (err) {
      const message = errorMessage(err);
      setFormError(message);
      push("error", `Could not create admin. ${message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w3r">
      <Link className="w3r-backlink" to="/admin/users">
        Back to users
      </Link>
      <header className="w3r-header">
        <div>
          <h1>Create admin</h1>
          <p className="w3r-sub">Add another administrator to the web admin app</p>
        </div>
      </header>

      <div className="w3r-detail">
        <section className="w3r-card" aria-labelledby="new-admin-h">
          <h2 id="new-admin-h">New admin</h2>
          <p className="w3r-banner">
            Admins can approve requests, block owners and create other admins. Share the temporary password through a
            secure channel, and ask the new admin to change it after the first sign-in.
          </p>

          <form ref={formRef} className="w3r-form" onSubmit={onSubmit} noValidate>
            <TextField id="admin-name" label="Full name" value={values.name} onChange={set("name")} error={errors.name} autoComplete="off" />
            <TextField id="admin-email" label="Email" type="email" value={values.email} onChange={set("email")} error={errors.email} autoComplete="off" />
            <TextField
              id="admin-password"
              label="Temporary password"
              type={showPw ? "text" : "password"}
              value={values.password}
              onChange={set("password")}
              error={errors.password}
              autoComplete="new-password"
            />

            <div className="w3r-pwrow">
              <button type="button" className="w3r-btn" onClick={onGenerate} disabled={submitting}>
                Generate password
              </button>
              <button type="button" className="w3r-btn" aria-pressed={showPw} onClick={() => setShowPw((s) => !s)}>
                {showPw ? "Hide password" : "Show password"}
              </button>
              <button type="button" className="w3r-btn" onClick={onCopy} disabled={!values.password}>
                Copy password
              </button>
            </div>

            <ul className="w3r-checks" aria-label="Password rules">
              {checks.map((c) => (
                <li key={c.label} className={`w3r-check${c.ok ? " w3r-check--ok" : ""}`}>
                  <span aria-hidden="true">{c.ok ? "\u2713" : "\u2022"}</span>
                  {c.label} <span className="w3r-sr">({c.ok ? "met" : "not met"})</span>
                </li>
              ))}
            </ul>

            <TextField
              id="admin-confirm"
              label="Confirm password"
              type={showPw ? "text" : "password"}
              value={values.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
              autoComplete="new-password"
            />

            {formError && (
              <p className="w3r-error" role="alert">
                {formError}
              </p>
            )}

            <div>
              <button type="submit" className="w3r-btn w3r-btn--primary" disabled={submitting}>
                {submitting ? "Creating admin" : "Create admin"}
              </button>
            </div>
          </form>
        </section>

        <section className="w3r-card" aria-labelledby="admins-h">
          <h2 id="admins-h">Current admins</h2>
          {adminsError && !admins ? (
            <div role="alert">
              <p className="w3r-error">{adminsError}</p>
              <button className="w3r-btn" onClick={loadAdmins}>
                Try again
              </button>
            </div>
          ) : !admins ? (
            <div role="status" aria-label="Loading admins">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w3r-skel" style={{ height: 32, marginBottom: 10 }} />
              ))}
            </div>
          ) : admins.length === 0 ? (
            <p className="w3r-sub">No admins found.</p>
          ) : (
            <table className="w3r-minitable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{fmtDate(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <Toasts toasts={toasts} />
    </div>
  );
}

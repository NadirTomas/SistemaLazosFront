function FormField({ label, children, error, helpText, fullWidth = false }) {
  return (
    <label className={`form-field ${fullWidth ? 'full' : ''}`}>
      <span className="form-label">{label}</span>
      {children}
      {error && <span className="form-error">{error}</span>}
      {!error && helpText && <span className="form-help">{helpText}</span>}
    </label>
  )
}

export default FormField

function TextAreaInput({ className = '', ...props }) {
  return <textarea className={`form-input form-textarea ${className}`.trim()} {...props} />
}

export default TextAreaInput

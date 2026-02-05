function SecondaryButton({ className = '', ...props }) {
  return <button className={`btn-secondary ${className}`.trim()} {...props} />
}

export default SecondaryButton

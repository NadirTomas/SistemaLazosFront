function PrimaryButton({ className = '', ...props }) {
  return <button className={`btn-primary ${className}`.trim()} {...props} />
}

export default PrimaryButton

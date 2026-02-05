function SelectInput({ className = '', children, ...props }) {
  return (
    <select className={`form-input ${className}`.trim()} {...props}>
      {children}
    </select>
  )
}

export default SelectInput

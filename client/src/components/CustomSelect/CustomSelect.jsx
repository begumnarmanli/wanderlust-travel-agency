import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({ options, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={styles.customSelectWrapper} ref={dropdownRef}>
      <div
        className={`${styles.customSelectTrigger} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.triggerLeft}>
          {icon && <i className={`${icon} ${styles.selectIcon}`}></i>}
          <span className={styles.selectedText}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <i
          className={`fas fa-chevron-down ${styles.arrowIcon} ${
            isOpen ? styles.rotate : ""
          }`}
        ></i>
      </div>

      {isOpen && (
        <div className={styles.customDropdown}>
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`${styles.customOption} ${
                value === option.value ? styles.active : ""
              } ${index === 0 ? styles.first : ""}`}
              onClick={() => handleSelect(option.value)}
            >
              <div className={styles.optionLeft}>
                {option.icon && (
                  <i className={`${option.icon} ${styles.optionIcon}`}></i>
                )}
                <span>{option.label}</span>
              </div>
              {value === option.value && (
                <i className={`fas fa-check ${styles.checkIcon}`}></i>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

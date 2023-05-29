import React, { useState } from "react";

type Button = {
  value: string;
  label: string;
};

type ToggleProps = {
  buttons: Button[];
  onChange: (value: string) => void;
};

const styles = {
  button: {
    // margin: "0 5px",
    padding: "10px",
    fontSize: "20px",
    border: "none",
    "border-radius": "13px",
    'background': 'transparent',
    'width': '16rem',
    'height': '4.2rem',
  },
  
  activeButton: {
    background: "rgba(109, 66, 234, 0.15)",
    color: "#6643e2",
    'font-weight': '900'
  },
  container: {
    padding: '3px',
    border: '3px solid #6643e2',
    'border-radius': '16px',
    width: '48.8rem',
    height: '5rem',
    margin: '10px'
  }
};

const TripleToggleSwitch: React.FC<ToggleProps> = ({ buttons, onChange }) => {
  const [active, setActive] = useState<string>(buttons[0].value);

  const handleClick = (value: string) => {
    setActive(value);
    onChange(value);
  };

  return (
    <div style={styles.container}>
      {buttons.map((button) => (
        <button
          key={button.value}
          onClick={() => handleClick(button.value)}
          style={
            button.value === active
              ? { ...styles.button, ...styles.activeButton }
              : styles.button
          }
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default TripleToggleSwitch;

import React, { useEffect, useState } from "react";
import { ReactComponent as CopyIcon } from "./images/icon-copy.svg";
import { ReactComponent as CheckIcon } from "./images/icon-check.svg";
import { ReactComponent as ArrowIcon } from "./images/icon-arrow-right.svg";
import "./styles/App.scss";

const Checkbox: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = (props) => {
  const { className } = props;
  return (
    <div className="checkbox-wrapper">
      <input
        type="checkbox"
        {...props}
        className={className ? `${className} checkbox` : "checkbox"}
      />
      <span className="checkbox-icon">
        <CheckIcon />
      </span>
    </div>
  );
};

function Form(props: {
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}) {
  const checkboxes = [
    {
      name: "includeUppers",
      state: useState(false),
      label: "Uppercase Letters",
    },
    {
      name: "includeLowers",
      state: useState(false),
      label: "Lowercase Letters",
    },
    { name: "includeNums", state: useState(false), label: "Numbers" },
    { name: "includeSymbols", state: useState(false), label: "Symbols" },
  ];
  const [passLength, setPassLength] = useState(0);
  const checkedCount = checkboxes.filter(
    (checkbox) => checkbox.state[0] === true
  ).length;
  const strengthColors = ["", "red", "orange", "yellow", "green"];
  const strengthNames = ["", "too weak!", "weak", "medium", "strong"];
  const showStrength: boolean = Boolean(checkedCount && passLength);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    let letters = "";
    let thePassword = "";
    if (checkboxes[0].state[0]) letters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Uppercase
    if (checkboxes[1].state[0]) letters += "abcdefghijklmnopqrstuvwxyz"; // Lowercase
    if (checkboxes[2].state[0]) letters += "0123456789"; // Digits
    if (checkboxes[3].state[0])
      letters += "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ "; // Symbols
    for (let i = 0; i < passLength; i++)
      thePassword += letters[Math.floor(Math.random() * letters.length)];
    props.setPassword(thePassword);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-char-length">
        <p>Character Length</p>
        <span>{passLength}</span>
      </div>
      <input
        type="range"
        name="length"
        min={0}
        max={20}
        value={passLength}
        onChange={(event) => {
          setPassLength(parseInt((event.target as HTMLInputElement).value));
        }}
        className="form-range-slider"
      />
      <div className="form-checkboxes">
        {checkboxes.map((checkbox, i) => (
          <div className="form-checkboxes-line" key={i}>
            <Checkbox
              id={checkbox.name}
              checked={checkbox.state[0]}
              onChange={(event) => {
                checkbox.state[1]((event.target as HTMLInputElement).checked);
              }}
            />
            <label htmlFor={checkbox.name}>Include {checkbox.label}</label>
          </div>
        ))}
      </div>
      <div className="form-strength">
        <h3 className="form-strength-title">STRENGTH</h3>
        <div className="form-strength-content">
          <h2 className="form-strength-val">
            {showStrength ? strengthNames[checkedCount] : "empty"}
          </h2>
          <div
            className={
              "form-strength-bars" +
              (showStrength
                ? ` form-strength-bars-${strengthColors[checkedCount]}`
                : "")
            }
          >
            {checkboxes.map((_, i) => (
              <div
                className={
                  "form-strength-bar" +
                  (i < checkedCount ? " form-strength-bar-colored" : "")
                }
                key={i}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <button type="submit" className="form-btn" disabled={!showStrength}>
        <span>Generate</span>
        <ArrowIcon className="form-btn-arrow" />
      </button>
    </form>
  );
}

function Top({ password }: { password: string }) {
  const [passwordCopied, setPasswordCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(password);
    setPasswordCopied(true);
  };

  useEffect(() => {
    if (passwordCopied)
      setTimeout(() => {
        setPasswordCopied(false);
      }, 1250);
  }, [passwordCopied]);

  return (
    <div
      className={`top ${password.length ? "active" : "empty"}`}
      onClick={handleClick}
    >
      <h2 className="heading-lg">{password.length ? password : "P4$5W0rD!"}</h2>
      {passwordCopied ? (
        <CheckIcon className="top-icon top-icon-check" />
      ) : (
        <CopyIcon className="top-icon" />
      )}
    </div>
  );
}

function App() {
  const [password, setPassword] = useState("");

  return (
    <div className="App">
      <h1 className="heading-md top-title">Password Generator</h1>
      <div className="content">
        <Top password={password} />
        <Form setPassword={setPassword} />
      </div>
    </div>
  );
}

export default App;

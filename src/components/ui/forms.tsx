import classnames from "classnames";
import React, { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
// import Txt, { TxtSize } from "~/components/ui/txt";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput(props: InputProps) {
  const { className, ...attributes } = props;
  return <input className={classnames("h2 pa2 ba b--accent", className)} type="text" {...attributes} />;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { [value: string]: ReactNode };
  outlined?: boolean;
}

export function Select(props: SelectProps) {
  const { options, outlined, className, ...attributes } = props;

  return (
    <select
      className={classnames("h2 ba b--white", className, {
        "bg-transparent bw0 white outline-0": outlined,
      })}
      {...attributes}
    >
      {Object.keys(options).map((value) => (
        <option key={value} value={value}>
          {options[value]}
        </option>
      ))}
    </select>
  );
}

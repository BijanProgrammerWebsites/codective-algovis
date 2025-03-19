import { ComponentProps, FormEvent, ReactElement } from "react";

import clsx from "clsx";

import styles from "./form.module.css";

type Props = ComponentProps<"form">;

export default function FormComponent({
  className,
  children,
  onSubmit,
  ...otherProps
}: Props): ReactElement {
  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      className={clsx(styles.form, className)}
      onSubmit={submitHandler}
      {...otherProps}
    >
      {children}
    </form>
  );
}

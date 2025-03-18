import { ReactElement } from "react";

import { NavLink } from "react-router";

import clsx from "clsx";

import { NavItemType } from "../../types/nav-item.type.ts";

import styles from "./nav-item.module.css";

type Props = {
  item: NavItemType;
};

export default function NavItemComponent({ item }: Props): ReactElement {
  return (
    <li className={styles["nav-item"]}>
      <NavLink
        to={item.href}
        className={({ isActive }) => clsx(isActive && styles.active)}
      >
        {item.title}
      </NavLink>
    </li>
  );
}

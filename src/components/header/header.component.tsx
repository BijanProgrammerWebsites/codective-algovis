import { ReactElement } from "react";

import { Link } from "react-router";

import NavItemComponent from "./components/nav-item/nav-item.component.tsx";
import { NavItemType } from "./types/nav-item.type.ts";

import styles from "./header.module.css";

const navItems: NavItemType[] = [{ title: "Home", href: "/" }];

function HeaderComponent(): ReactElement {
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.logo}>
        AlgoVis
      </Link>
      <nav>
        <ul>
          {navItems.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default HeaderComponent;

import { useContext } from "react";
import { type TListItemProps } from "./List.model";
import styles from "./List.module.css";
import { listContext } from "./ListProvider";

const WikiListItem = (props: TListItemProps) => {
  const { handleClick, isActive, children, rightSection, leftSection } = props;
  const { isHoverable } = useContext(listContext);
  const hoverClass = isHoverable ? styles.hover : "";
  const isActiveClass = isActive ? styles.active : "";
  const clickableClass = handleClick ? styles.clickable : "";
  const classes = `${styles.item} ${hoverClass} ${isActiveClass} ${clickableClass}`;
  return (
    <li className={classes}>
      <div className={styles.left}>{leftSection}</div>
      <div onClick={handleClick} className={styles.content}>
        {children}
      </div>
      <div className={styles.right}>{rightSection}</div>
    </li>
  );
};

export default WikiListItem;

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={styles.container}>
      <img className={styles.logo} src="/images/Logo.svg" alt="logo" />
    </div>
  );
}

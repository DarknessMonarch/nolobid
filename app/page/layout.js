import styles from '@/app/styles/layout.module.css';
import SideNav from '@/app/components/SideNav';
import NavBar from '@/app/components/NavBar';
export default function PageLayout({ children }) {

  return (
    <div className={styles.layoutMain}>
      <SideNav />
      <div className={styles.content}>
        <NavBar/>
        {children}
      </div>
    </div>

  );
}

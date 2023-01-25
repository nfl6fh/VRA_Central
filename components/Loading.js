import styles from '../styles/Loading.module.css'

export default function Loading(props) {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.ldsRing}><div></div><div></div><div></div><div></div></div>
        </div>
    )
}
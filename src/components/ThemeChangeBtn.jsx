// Example Button Component
const ThemeChangeBtn = ({ children, variant = 'primary' }) => {
    const styles = {
        primary: {
            backgroundColor: 'var(--primary-gold)',
            color: 'var(--primary-dark)',
            border: 'none'
        },
        secondary: {
            backgroundColor: 'var(--primary-blue)',
            color: 'var(--white)',
            border: 'none'
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--primary-gold)',
            border: '2px solid var(--primary-gold)'
        }
    };

    return (
        <button style={styles[variant]}>
            {children}
        </button>
    );
};

export default ThemeChangeBtn;

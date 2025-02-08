module.exports = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0a0f1c',
                    card: '#1a1f2e',
                    text: '#ffffff'
                },
                light: {
                    bg: '#f8fafc',
                    card: '#ffffff',
                    text: '#1a1f2e'
                }
            }
        }
    },
    variants: {
        extend: {
            backgroundColor: ['dark'],
            textColor: ['dark'],
            borderColor: ['dark']
        }
    }
} 
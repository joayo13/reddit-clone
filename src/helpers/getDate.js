export const getDatefromSeconds = (createdAt, currentTime) => {
    if(Math.round((currentTime - createdAt) / 86400) > 0) {
        if(Math.round((currentTime - createdAt) / 86400) === 1) {
            return '1 day ago'
        }
        return Math.round((currentTime - createdAt) / 86400) + ` days ago`
    }
    if(Math.round((currentTime - createdAt) / 3600) > 0) {
        if(Math.round((currentTime - createdAt) / 3600) === 1) {
            return '1 hour ago'
        }
        return Math.round((currentTime - createdAt) / 3600) + ` hours ago`
    }
    if(Math.round((currentTime - createdAt) / 60) > 0) {
        if(Math.round((currentTime - createdAt) / 60) === 1) {
            return '1 minute ago'
        }
        return Math.round((currentTime - createdAt) / 60) + ` minutes ago`
    }
    return 'Just now'
}
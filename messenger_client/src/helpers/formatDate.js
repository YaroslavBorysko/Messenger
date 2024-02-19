const dateTimeFormat = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
}


export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', dateTimeFormat);
}
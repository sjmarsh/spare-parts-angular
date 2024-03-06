const getLocalDateTimeString = () =>
{
    let offset = (new Date()).getTimezoneOffset() * 60000; 
    return (new Date(Date.now() - offset)).toISOString().slice(0,-1);
}

export {
    getLocalDateTimeString
}

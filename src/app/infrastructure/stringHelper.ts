const camelize = (target: string) : string => {
    const parts = target.split(/[\s-:_]/);  // split string on - : _ or space
    if(parts.length === 1) {
        return`${target.charAt(0).toLowerCase()}${target.slice(1, target.length)}`;    
    }
    const camelizedParts = parts.map(p => {
        const part = p.toLowerCase();
        const titlizedPart = part.length === 1 ? `${part.charAt(0).toUpperCase()}` : `${part.charAt(0).toUpperCase()}${part.slice(1, part.length)}`;
        return titlizedPart;
    });
    const combinedParts = camelizedParts.join('');
    const camelized = `${combinedParts.charAt(0).toLowerCase()}${combinedParts.slice(1, combinedParts.length)}`;
    return camelized;
}

/** Attempts to convert value to date and return a locally formated string. Returns null if value is not a date.*/
const getFormattedDate = (target: any | null) : string | null => {
    if(!target){
        return null;
    }

    if(target instanceof Date) {
        return target.toLocaleDateString('en-au');
    }
    
    // expects yyyy/MM/dd or dd/MM/yyy or yyyy-MM-dd or dd-MM-yyyy (and variations of single or double digit days/months)
    const dateFormatExp = /(\d{1,4})(\/|-)(\d{1,2})(\/|-)(\d{1,4})/;  
    const targetStr = target.toString() as string;
    if(dateFormatExp.test(targetStr)) {
        const date = new Date(target);
        return date.toLocaleDateString('en-au');    
    }

    return null;
}

const getFormattedNumber = (target: any | null) : string | null => {
    if(!target){
        return null;
    }

    if(!isNaN(parseFloat(target))){
        try{
            return Number(target).toFixed(2);
        } catch(e) {
            console.log('not a number');
            return null;
        }
    }

    return null;
}

const getFormattedValue = (target: any | null) : string => {
    if(!target){
        return "";
    }
    
    if(typeof target === 'boolean') {
        return `${target}`;
    }

    let date = getFormattedDate(target);
    if(date) {
        return date;
    }
    let number = getFormattedNumber(target);
    if(number) {
        return number;
    }
    return target;
}

export {
    camelize,
    getFormattedDate,
    getFormattedNumber,
    getFormattedValue
}
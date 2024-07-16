import WithId from "../types/withId"

const updateArrayItem = <T extends WithId>(array : Array<T>, updatedItem: T)  => {
    return array.map((item) => {
        if (item.id !== updatedItem.id) {
            return item
        }
        return {
            ...item,
            ...updatedItem
        }
    });
}

interface Group<T> {
    key: string;
    values: Array<T>;
}

// Note: this produces a more C# LINQ style of grouped objects.  An alternative option is shown below where groups are stored under properties on a single object.
const groupByKey = <T>(array: T[], key: keyof T): Array<Group<T>> => {
    
    let groups = new Array<Group<T>>();
    array.forEach(item => {
        const itemKey = item[key];
        let existingGroup = groups.find(g => g.key === itemKey);
        if(existingGroup) {
            existingGroup.values = [ ... existingGroup.values, item ];
        }
        else {
            groups = [ ... groups, { key: itemKey, values: new Array<T>(item) } as Group<T>]
        }
    });

    return groups;
}

const groupByFunc = <T>(array: T[], func: (item: T) => string): Array<Group<T>> => {
    
    let groups = new Array<Group<T>>();
    array.forEach(item => {        
        const itemKey = func(item);
        let existingGroup = groups.find(g => g.key === itemKey);
        if(existingGroup) {
            existingGroup.values = [ ... existingGroup.values, item ];
        }
        else {
            groups = [ ... groups, { key: itemKey, values: new Array<T>(item) } as Group<T>]
        }
    });

    return groups;
}

/*
// This produces an object where the keys are properties and the values are stored in an array assigned to the key property
const groupBy = <T>(array: T[], keys: (keyof T)[]): { [key: string]: T[] } => {
    return array.reduce((group, item) => {
      const objKey = keys.map(key => `${ item[key] }`).join(':');
      console.log(`objKey: `, objKey);
      if (group[objKey]) {  // already has key
        group[objKey].push(item);
      } else {
        group[objKey] = [item];  // create key
      }
      return group;
    }, {} as { [key: string]: T[] });
}*/


export {
    updateArrayItem,
    Group,
    groupByKey,
    groupByFunc
}
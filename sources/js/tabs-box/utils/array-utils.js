class ArrayUtils {

    static getItemByField(items, fieldName, fieldValue) {
        let foundItem = items.filter(item => item[fieldName] === fieldValue);
        return foundItem.length !== 0 ? foundItem[0] : undefined;
    }

    static getItemById(items, id) {
        return ArrayUtils.getItemByField(items, "id", id);
    }

    static addItem(items, item, position) {
        let foundItem = ArrayUtils.getItemById(items, item.id);
        if (!foundItem) {
            if (position === undefined) {
                items.push(item);
            } else {
                items.splice(position, 0, item)
            }
            return true;
        }
        return false;
    }

    static changeItemPosition(items, itemId, newIndex) {
        if (newIndex === undefined || newIndex < 0) {
            return false;
        }
        let item = ArrayUtils.getItemById(items, itemId);
        if (item) {
            let oldIndex = items.indexOf(item);
            let tmp = items[newIndex];
            items[newIndex] = item;
            items[oldIndex] = tmp;
            return true;
        }
        return false;
    }

    static removeItemById(items, itemId) {
        let item = ArrayUtils.getItemByField(items, "id", itemId);
        if (item) {
            let index = items.indexOf(item);
            if (index >= 0) {
                items.splice(index, 1);
                return true;
            }
        }
        return false;
    }
}
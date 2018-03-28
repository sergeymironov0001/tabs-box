class CommonUtils {

    static generateUniqueId() {
        return Math.random().toString(36).substr(2, 16);
    }
}
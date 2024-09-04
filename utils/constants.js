export function scrollToFirstError(errors, prefix) {
    for (const key of Object.keys(errors)) {
        if (errors[key]) {
            const targetElement = document.getElementById(prefix ? prefix + key : key);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
            break;
        }
    }
}
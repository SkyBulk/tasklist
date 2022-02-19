console.log("--> useColorStore");

const charchoal = {
    id: null,
    name: "Charcoal",
    value: "#808080"
}

export default (set, get) => ({
    colors: [/*
            {
                id: null,
                name: "Charcoal",
                value: "#808080"
            },...
        */],
    getColor(colorId) {
        return get().colors
            .find(color => color.id === colorId)
    },
    setColors: (rawColors) => set({ colors: [charchoal, ...rawColors] })
});
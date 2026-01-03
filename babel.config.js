module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: [
            "react-native-worklets-core/plugin",
            [
                "module-resolver",
                {
                    root: ["./src"],
                    alias: {
                        "@": "./src",
                    },
                },
            ],
            "react-native-reanimated/plugin",
        ],
    };
};
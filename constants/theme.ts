

type FONTWEIGHTS = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined;

interface ThemeProps {
    colors: {
        white: string;
        black: string;
        grayBG: string;
        neutral: (opacity: number) => string;
    },
    fontWeights: {
        medium: FONTWEIGHTS;
        semibold: FONTWEIGHTS;
        bold: FONTWEIGHTS;
    },
    radius: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    }
}


export const theme: ThemeProps = {
    colors: {
        white: "#fff",
        black: "#000",
        grayBG: "#e5e5e5",
        neutral: (opacity) => `rgba(10, 10, 10, ${opacity})`,
    },
    fontWeights: {
        medium: "500",
        semibold: "600",
        bold: "700",
    },
    radius: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18
    }
}
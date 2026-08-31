# Design Tokens

The token contract below is Penpot-ready and mirrors the CSS custom properties used by the web app scaffold.

```json
{
  "$schema": "https://design-tokens.org/format/schema.json",
  "color": {
    "surface": {
      "canvas": {
        "value": "hsl(210 20% 98%)"
      },
      "panel": {
        "value": "hsl(0 0% 100%)"
      },
      "inverse": {
        "value": "hsl(222 47% 11%)"
      }
    },
    "text": {
      "default": {
        "value": "hsl(222 47% 11%)"
      },
      "muted": {
        "value": "hsl(215 16% 47%)"
      },
      "inverse": {
        "value": "hsl(210 20% 98%)"
      }
    },
    "brand": {
      "primary": {
        "value": "hsl(221 83% 53%)"
      },
      "primaryHover": {
        "value": "hsl(221 83% 45%)"
      },
      "accent": {
        "value": "hsl(174 70% 40%)"
      }
    },
    "feedback": {
      "success": {
        "value": "hsl(142 71% 45%)"
      },
      "warning": {
        "value": "hsl(38 92% 50%)"
      },
      "danger": {
        "value": "hsl(0 84% 60%)"
      }
    }
  },
  "font": {
    "family": {
      "sans": {
        "value": "Inter, ui-sans-serif, system-ui, sans-serif"
      },
      "mono": {
        "value": "'JetBrains Mono', ui-monospace, monospace"
      }
    },
    "size": {
      "sm": {
        "value": "0.875rem"
      },
      "md": {
        "value": "1rem"
      },
      "lg": {
        "value": "1.125rem"
      },
      "xl": {
        "value": "1.5rem"
      }
    }
  },
  "spacing": {
    "1": {
      "value": "0.25rem"
    },
    "2": {
      "value": "0.5rem"
    },
    "3": {
      "value": "0.75rem"
    },
    "4": {
      "value": "1rem"
    },
    "6": {
      "value": "1.5rem"
    },
    "8": {
      "value": "2rem"
    }
  },
  "shape": {
    "radius": {
      "sm": {
        "value": "0.375rem"
      },
      "md": {
        "value": "0.75rem"
      },
      "pill": {
        "value": "9999px"
      }
    }
  },
  "motion": {
    "duration": {
      "fast": {
        "value": "120ms"
      },
      "base": {
        "value": "180ms"
      }
    },
    "easing": {
      "standard": {
        "value": "cubic-bezier(0.2, 0, 0, 1)"
      }
    }
  }
}
```

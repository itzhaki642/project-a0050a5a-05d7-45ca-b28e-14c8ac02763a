import { useState, useEffect } from "react";
import { Accessibility, Plus, Minus, Type, Eye, Pause, Link2, RotateCcw, X } from "lucide-react";

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  pauseAnimations: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  readableFont: false,
  pauseAnimations: false,
};

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem("accessibility-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const applySettings = (s: AccessibilitySettings) => {
    const html = document.documentElement;
    
    // Font size
    html.style.fontSize = `${s.fontSize}%`;
    
    // High contrast
    if (s.highContrast) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }
    
    // Grayscale
    if (s.grayscale) {
      html.classList.add("grayscale-mode");
    } else {
      html.classList.remove("grayscale-mode");
    }
    
    // Highlight links
    if (s.highlightLinks) {
      html.classList.add("highlight-links");
    } else {
      html.classList.remove("highlight-links");
    }
    
    // Readable font
    if (s.readableFont) {
      html.classList.add("readable-font");
    } else {
      html.classList.remove("readable-font");
    }
    
    // Pause animations
    if (s.pauseAnimations) {
      html.classList.add("pause-animations");
    } else {
      html.classList.remove("pause-animations");
    }
  };

  const increaseFontSize = () => {
    setSettings(prev => ({ ...prev, fontSize: Math.min(prev.fontSize + 10, 150) }));
  };

  const decreaseFontSize = () => {
    setSettings(prev => ({ ...prev, fontSize: Math.max(prev.fontSize - 10, 80) }));
  };

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    if (key === "fontSize") return;
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-50 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="פתח תפריט נגישות"
      >
        <Accessibility className="h-6 w-6" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed left-4 bottom-24 z-50 w-80 bg-card border border-border rounded-2xl shadow-xl p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">הגדרות נגישות</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
                aria-label="סגור תפריט נגישות"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Font Size */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">גודל טקסט</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseFontSize}
                    className="w-8 h-8 flex items-center justify-center bg-background border border-border rounded-lg hover:bg-accent transition-colors"
                    aria-label="הקטן טקסט"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm w-12 text-center">{settings.fontSize}%</span>
                  <button
                    onClick={increaseFontSize}
                    className="w-8 h-8 flex items-center justify-center bg-background border border-border rounded-lg hover:bg-accent transition-colors"
                    aria-label="הגדל טקסט"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* High Contrast */}
              <button
                onClick={() => toggleSetting("highContrast")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  settings.highContrast ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span className="text-sm font-medium">ניגודיות גבוהה</span>
                </div>
                <span className="text-xs">{settings.highContrast ? "פעיל" : "כבוי"}</span>
              </button>

              {/* Grayscale */}
              <button
                onClick={() => toggleSetting("grayscale")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  settings.grayscale ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span className="text-sm font-medium">גווני אפור</span>
                </div>
                <span className="text-xs">{settings.grayscale ? "פעיל" : "כבוי"}</span>
              </button>

              {/* Highlight Links */}
              <button
                onClick={() => toggleSetting("highlightLinks")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  settings.highlightLinks ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  <span className="text-sm font-medium">הדגשת קישורים</span>
                </div>
                <span className="text-xs">{settings.highlightLinks ? "פעיל" : "כבוי"}</span>
              </button>

              {/* Readable Font */}
              <button
                onClick={() => toggleSetting("readableFont")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  settings.readableFont ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  <span className="text-sm font-medium">פונט קריא</span>
                </div>
                <span className="text-xs">{settings.readableFont ? "פעיל" : "כבוי"}</span>
              </button>

              {/* Pause Animations */}
              <button
                onClick={() => toggleSetting("pauseAnimations")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  settings.pauseAnimations ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Pause className="h-5 w-5" />
                  <span className="text-sm font-medium">עצירת אנימציות</span>
                </div>
                <span className="text-xs">{settings.pauseAnimations ? "פעיל" : "כבוי"}</span>
              </button>

              {/* Reset Button */}
              <button
                onClick={resetSettings}
                className="w-full flex items-center justify-center gap-2 p-3 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors text-sm font-medium"
              >
                <RotateCcw className="h-4 w-4" />
                <span>איפוס הגדרות</span>
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              אתר זה עומד בתקן נגישות ישראלי
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default AccessibilityWidget;

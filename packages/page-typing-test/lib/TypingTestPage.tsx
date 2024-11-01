import { useSettings } from "@keybr/settings";
import { makeStats } from "@keybr/textinput";
import { type ReactNode, useMemo, useState } from "react";
import { Report } from "./components/Report.tsx";
import { SettingsScreen } from "./components/SettingsScreen.tsx";
import { TestScreen } from "./components/TestScreen.tsx";
import { TextGeneratorLoader } from "./generators/index.ts";
import { toCompositeSettings } from "./settings.ts";

export function TypingTestPage(): ReactNode {
  const enum View {
    Test,
    Report,
    Settings,
  }

  const { settings } = useSettings();
  const compositeSettings = useMemo(
    () => toCompositeSettings(settings),
    [settings],
  );
  const [view, setView] = useState(View.Test);
  const [stats, setStats] = useState(makeStats([]));

  switch (view) {
    case View.Test:
      return (
        <TextGeneratorLoader textSource={compositeSettings.textSource}>
          {(generator) => {
            return (
              <TestScreen
                settings={compositeSettings}
                generator={generator}
                mark={generator.mark()}
                onComplete={(stats) => {
                  setView(View.Report);
                  setStats(stats);
                }}
                onConfigure={() => {
                  setView(View.Settings);
                }}
              />
            );
          }}
        </TextGeneratorLoader>
      );
    case View.Report:
      return (
        <Report
          stats={stats}
          onNext={() => {
            setView(View.Test);
          }}
        />
      );
    case View.Settings:
      return (
        <SettingsScreen
          onSubmit={() => {
            setView(View.Test);
          }}
        />
      );
  }
}

import React, { useState, useEffect } from 'react';

export default function ThemeContainer({ children }) {
  const [theme, setTheme] = useState('modern');

  useEffect(() => {
    const themeElements = document.querySelectorAll(
      '[class*="modern:"], [class*="retro:"]'
    );
    console.log('theme elements', themeElements);

    themeElements.forEach(element => {
      const classNames = element.className.split(' ');
      classNames.forEach(className => {
        if (className.startsWith(`${theme}:`)) {
          const newClassName = className.substring(theme.length + 1);
          element.classList.add(newClassName);
        } else if (
          className.startsWith('modern:') ||
          className.startsWith('retro:')
        ) {
          const newClassName = className.substring(className.indexOf(':') + 1);
          element.classList.remove(newClassName);
        }
      });
    });
  }, [theme]);

  return <div>{children}</div>;
}

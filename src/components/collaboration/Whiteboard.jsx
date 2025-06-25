import React, { useEffect, useState, memo } from 'react';

const WhiteboardComponent = ({ isDarkMode }) => {
  const [Excalidraw, setExcalidraw] = useState(null);

  useEffect(() => {
    import('@excalidraw/excalidraw').then(comp => {
      setExcalidraw(comp.Excalidraw);
    });
  }, []);

  const excalidrawKey = isDarkMode ? 'dark' : 'light';
  
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {Excalidraw && (
        <Excalidraw
          key={excalidrawKey}
          theme={isDarkMode ? 'dark' : 'light'}
          initialData={{
            appState: {
              viewBackgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
            },
          }}
        />
      )}
    </div>
  );
};

export default memo(WhiteboardComponent);
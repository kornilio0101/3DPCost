import webview
import os
import sys

def get_base_path():
    if hasattr(sys, '_MEIPASS'):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

if __name__ == '__main__':
    base_path = get_base_path()
    # Path to index.html inside the bundled dist folder
    index_html = os.path.join(base_path, 'dist', 'index.html')
    
    # We use some extra logging to help if it fails again
    if not os.path.exists(index_html):
        # In case of catastrophe, show an alert
        webview.create_window('Error', html=f"<h1>Resource Error</h1><p>Could not find {index_html}</p>")
        webview.start()
        sys.exit(1)

    window = webview.create_window(
        '3DP Cost Calculator', 
        url=index_html,
        width=1280,
        height=800,
        min_size=(1000, 700),
        background_color='#0d0d12'
    )
    
    # Start the webview with GUI=None (let it pick best native)
    webview.start()

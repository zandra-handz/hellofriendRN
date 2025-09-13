const { withMainActivity, withPlugins } = require("@expo/config-plugins");

module.exports = function withShareIntent(config) {
  return withMainActivity(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      "public class MainActivity extends ReactActivity {",
      `
      import android.content.Intent;
      import android.os.Bundle;
      import expo.modules.ReactActivityDelegateWrapper;

      public class MainActivity extends ReactActivity {
        @Override
        protected void onCreate(Bundle savedInstanceState) {
          super.onCreate(savedInstanceState);
          handleShareIntent(getIntent());
        }

        @Override
        public void onNewIntent(Intent intent) {
          super.onNewIntent(intent);
          handleShareIntent(intent);
        }

        private void handleShareIntent(Intent intent) {
          if (intent == null) return;
          String action = intent.getAction();
          String type = intent.getType();
          if (Intent.ACTION_SEND.equals(action) && type != null) {
            if ("text/plain".equals(type)) {
              String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
              ShareIntentModule.sendSharedText(sharedText);
            } else if (type.startsWith("image/")) {
              android.net.Uri imageUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
              if (imageUri != null) {
                ShareIntentModule.sendSharedImage(imageUri.toString());
              }
            }
          }
        }
      }
      `
    );
    return config;
  });
};

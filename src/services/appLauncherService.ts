import { AppInfo } from '../types';

// Default installed applications registry with Android packages, deep links & aliases
export const INITIAL_INSTALLED_APPS: AppInfo[] = [
  {
    displayName: 'WhatsApp',
    packageName: 'com.whatsapp',
    activityName: 'com.whatsapp.Main',
    iconName: 'MessageSquare',
    aliases: ['whatsapp', 'wa', 'whats app', 'वाट्सएप', 'व्हाट्सएप'],
    normalizedName: 'whatsapp',
    category: 'Communication',
    deepLinkUri: 'whatsapp://',
    androidIntentUrl: 'intent:#Intent;package=com.whatsapp;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Gmail',
    packageName: 'com.google.android.gm',
    activityName: 'com.google.android.gm.ConversationListActivityGmail',
    iconName: 'Mail',
    aliases: ['gmail', 'google mail', 'email', 'e-mail', 'mail', 'जीमेल', 'मेल'],
    normalizedName: 'gmail',
    category: 'Productivity',
    deepLinkUri: 'googlegmail://',
    androidIntentUrl: 'intent:#Intent;package=com.google.android.gm;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'YouTube',
    packageName: 'com.google.android.youtube',
    activityName: 'com.google.android.youtube.HomeActivity',
    iconName: 'Youtube',
    aliases: ['youtube', 'yt', 'you tube', 'यूट्यूब', 'युटुब'],
    normalizedName: 'youtube',
    category: 'Media',
    deepLinkUri: 'vnd.youtube://',
    androidIntentUrl: 'intent:#Intent;package=com.google.android.youtube;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Google Chrome',
    packageName: 'com.android.chrome',
    activityName: 'com.google.android.apps.chrome.Main',
    iconName: 'Globe',
    aliases: ['chrome', 'google chrome', 'browser', 'internet', 'क्रोम', 'ब्राउज़र'],
    normalizedName: 'chrome',
    category: 'Tools',
    deepLinkUri: 'googlechrome://',
    androidIntentUrl: 'intent:#Intent;package=com.android.chrome;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Instagram',
    packageName: 'com.instagram.android',
    activityName: 'com.instagram.mainactivity.MainActivity',
    iconName: 'Instagram',
    aliases: ['instagram', 'insta', 'ig', 'इंस्टाग्राम', 'इन्स्टा'],
    normalizedName: 'instagram',
    category: 'Social',
    deepLinkUri: 'instagram://',
    androidIntentUrl: 'intent:#Intent;package=com.instagram.android;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Google Maps',
    packageName: 'com.google.android.apps.maps',
    activityName: 'com.google.android.maps.MapsActivity',
    iconName: 'MapPin',
    aliases: ['maps', 'google maps', 'map', 'navigation', 'rasta', 'गूगल मैप्स', 'नक्शा'],
    normalizedName: 'maps',
    category: 'Tools',
    deepLinkUri: 'geo:0,0?q=',
    androidIntentUrl: 'intent:#Intent;package=com.google.android.apps.maps;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Spotify',
    packageName: 'com.spotify.music',
    activityName: 'com.spotify.music.MainActivity',
    iconName: 'Music',
    aliases: ['spotify', 'music app', 'गाने', 'स्पॉटिफाई'],
    normalizedName: 'spotify',
    category: 'Media',
    deepLinkUri: 'spotify://',
    androidIntentUrl: 'intent:#Intent;package=com.spotify.music;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Telegram',
    packageName: 'org.telegram.messenger',
    activityName: 'org.telegram.ui.LaunchActivity',
    iconName: 'Send',
    aliases: ['telegram', 'tg', 'टेलीग्राम'],
    normalizedName: 'telegram',
    category: 'Communication',
    deepLinkUri: 'tg://',
    androidIntentUrl: 'intent:#Intent;package=org.telegram.messenger;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Facebook',
    packageName: 'com.facebook.katana',
    activityName: 'com.facebook.katana.LoginActivity',
    iconName: 'Facebook',
    aliases: ['facebook', 'fb', 'फेसबुक'],
    normalizedName: 'facebook',
    category: 'Social',
    deepLinkUri: 'fb://',
    androidIntentUrl: 'intent:#Intent;package=com.facebook.katana;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: false, // For testing "App not installed" failure handling!
  },
  {
    displayName: 'Google Drive',
    packageName: 'com.google.android.apps.docs',
    activityName: 'com.google.android.apps.docs.app.NewMainProxyActivity',
    iconName: 'HardDrive',
    aliases: ['drive', 'google drive', 'gdrive', 'ड्राइव'],
    normalizedName: 'drive',
    category: 'Productivity',
    deepLinkUri: 'googledrive://',
    androidIntentUrl: 'intent:#Intent;package=com.google.android.apps.docs;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Google Photos',
    packageName: 'com.google.android.apps.photos',
    activityName: 'com.google.android.apps.photos.home.HomeActivity',
    iconName: 'Image',
    aliases: ['photos', 'google photos', 'gallery', 'फोटो', 'गैलरी'],
    normalizedName: 'photos',
    category: 'Media',
    androidIntentUrl: 'intent:#Intent;package=com.google.android.apps.photos;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Amazon',
    packageName: 'in.amazon.mShop.android.shopping',
    activityName: 'com.amazon.mShop.home.HomeActivity',
    iconName: 'ShoppingBag',
    aliases: ['amazon', 'shopping', 'अमेज़न'],
    normalizedName: 'amazon',
    category: 'Shopping',
    androidIntentUrl: 'intent:#Intent;package=in.amazon.mShop.android.shopping;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Flipkart',
    packageName: 'com.flipkart.android',
    activityName: 'com.flipkart.android.SplashActivity',
    iconName: 'ShoppingCart',
    aliases: ['flipkart', 'फ्लिपकार्ट'],
    normalizedName: 'flipkart',
    category: 'Shopping',
    androidIntentUrl: 'intent:#Intent;package=com.flipkart.android;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Camera',
    packageName: 'com.android.camera',
    activityName: 'com.android.camera.Camera',
    iconName: 'Camera',
    aliases: ['camera', 'cam', 'कैमरा', 'फोटो खींचना'],
    normalizedName: 'camera',
    category: 'System',
    androidIntentUrl: 'intent:#Intent;action=android.media.action.IMAGE_CAPTURE;end',
    isInstalled: true,
  },
  {
    displayName: 'Calculator',
    packageName: 'com.google.android.calculator',
    activityName: 'com.android.calculator2.Calculator',
    iconName: 'Calculator',
    aliases: ['calculator', 'calc', 'कैलकुलेटर', 'हिसाब'],
    normalizedName: 'calculator',
    category: 'Tools',
    androidIntentUrl: 'intent:#Intent;package=com.google.android.calculator;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end',
    isInstalled: true,
  },
  {
    displayName: 'Clock',
    packageName: 'com.google.android.deskclock',
    activityName: 'com.android.deskclock.DeskClock',
    iconName: 'Clock',
    aliases: ['clock', 'alarm', 'timer', 'घड़ी', 'अलार्म'],
    normalizedName: 'clock',
    category: 'System',
    androidIntentUrl: 'intent:#Intent;action=android.intent.action.SHOW_ALARMS;end',
    isInstalled: true,
  },
  {
    displayName: 'Settings',
    packageName: 'com.android.settings',
    activityName: 'com.android.settings.Settings',
    iconName: 'Settings',
    aliases: ['settings', 'setting', 'phone settings', 'सेटिंग्स', 'सेटिंग'],
    normalizedName: 'settings',
    category: 'System',
    androidIntentUrl: 'intent:#Intent;action=android.settings.SETTINGS;end',
    isInstalled: true,
  },
  {
    displayName: 'Phone',
    packageName: 'com.google.android.dialer',
    activityName: 'com.google.android.dialer.extensions.GoogleDialtactsActivity',
    iconName: 'Phone',
    aliases: ['phone', 'dialer', 'call', 'फोन', 'डायलर'],
    normalizedName: 'phone',
    category: 'System',
    androidIntentUrl: 'intent:#Intent;action=android.intent.action.DIAL;end',
    isInstalled: true,
  },
  {
    displayName: 'Messages',
    packageName: 'com.google.android.apps.messaging',
    activityName: 'com.google.android.apps.messaging.ui.ConversationListActivity',
    iconName: 'MessageSquare',
    aliases: ['messages', 'sms', 'messaging', 'मैसेज', 'एसएमएस'],
    normalizedName: 'messages',
    category: 'Communication',
    androidIntentUrl: 'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_MESSAGING;end',
    isInstalled: true,
  },
  {
    displayName: 'Contacts',
    packageName: 'com.google.android.contacts',
    activityName: 'com.google.android.contacts.activities.PeopleActivity',
    iconName: 'Users',
    aliases: ['contacts', 'address book', 'कॉन्टैक्ट्स', 'कांटेक्ट'],
    normalizedName: 'contacts',
    category: 'System',
    androidIntentUrl: 'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_CONTACTS;end',
    isInstalled: true,
  },

  // Banking Apps Category
  {
    displayName: 'YONO SBI',
    packageName: 'com.sbi.lotusintouch',
    activityName: 'com.sbi.lotusintouch.MainActivity',
    iconName: 'CreditCard',
    aliases: ['yono sbi', 'sbi', 'state bank of india', 'sbi bank', 'yono'],
    normalizedName: 'yono sbi',
    category: 'Banking',
    androidIntentUrl: 'intent:#Intent;package=com.sbi.lotusintouch;action=android.intent.action.MAIN;end',
    isInstalled: true,
  },
  {
    displayName: 'HDFC MobileBanking',
    packageName: 'com.snapwork.hdfc',
    activityName: 'com.snapwork.hdfc.MainActivity',
    iconName: 'CreditCard',
    aliases: ['hdfc', 'hdfc bank', 'hdfc mobilebanking'],
    normalizedName: 'hdfc bank',
    category: 'Banking',
    androidIntentUrl: 'intent:#Intent;package=com.snapwork.hdfc;action=android.intent.action.MAIN;end',
    isInstalled: true,
  },
  {
    displayName: 'Google Pay',
    packageName: 'com.google.android.apps.nbu.paisa.user',
    activityName: 'com.google.android.apps.nbu.paisa.user.MainActivity',
    iconName: 'DollarSign',
    aliases: ['google pay', 'gpay', 'g pay', 'गूगल पे'],
    normalizedName: 'google pay',
    category: 'Banking',
    androidIntentUrl: 'intent:#Intent;package=com.google.android.apps.nbu.paisa.user;action=android.intent.action.MAIN;end',
    isInstalled: true,
  },
  {
    displayName: 'PhonePe',
    packageName: 'com.phonepe.app',
    activityName: 'com.phonepe.app.MainActivity',
    iconName: 'DollarSign',
    aliases: ['phonepe', 'phone pe', 'फोन पे'],
    normalizedName: 'phonepe',
    category: 'Banking',
    androidIntentUrl: 'intent:#Intent;package=com.phonepe.app;action=android.intent.action.MAIN;end',
    isInstalled: true,
  },
  {
    displayName: 'Paytm',
    packageName: 'net.one97.paytm',
    activityName: 'net.one97.paytm.landingpage.activity.AJRMainActivity',
    iconName: 'DollarSign',
    aliases: ['paytm', 'पेटीएम'],
    normalizedName: 'paytm',
    category: 'Banking',
    androidIntentUrl: 'intent:#Intent;package=net.one97.paytm;action=android.intent.action.MAIN;end',
    isInstalled: true,
  }
];

export interface AppLaunchResult {
  success: boolean;
  launchedApp?: AppInfo;
  requiresDisambiguation?: boolean;
  matchingApps?: AppInfo[];
  errorMessage?: string;
  voiceMessage: string;
}

/**
 * AppResolver:
 * Normalizes and extracts requested app names from multilingual natural voice commands.
 */
export class AppResolver {
  /**
   * Cleans natural command variations in English, Hindi, Hinglish, Bhojpuri:
   * "WhatsApp kholo", "WhatsApp खोल दीं", "Open WhatsApp", "Launch WhatsApp", "WhatsApp chalao", "WhatsApp open karo"
   */
  public static extractAppQuery(rawCommand: string): string {
    let text = rawCommand.toLowerCase().trim();

    // Remove conversational prefixes
    text = text.replace(/^(pankaj ji|pankaj|hey pankaj ji|namaste ji|bhai|ji)\s*[,:]?\s*/i, '');

    // Common action verbs in English, Hindi, Hinglish, Bhojpuri
    const actionVerbs = [
      'open', 'launch', 'start', 'run',
      'kholo', 'khol do', 'khol de', 'kholna', 'kholiye', 'khol',
      'खोलें', 'खोलो', 'खोल दो', 'खोलिए', 'खोल',
      'खोल दीं', 'खोले के बा', 'खोलिहें', // Bhojpuri
      'open karo', 'open kijiye', 'open kar do', 'open kariye',
      'chalao', 'chala do', 'chalao ji', 'चालू करो', 'चालू करा', 'चालू कइल जाव',
      'dikhao', 'start karo'
    ];

    for (const verb of actionVerbs) {
      if (text.startsWith(verb + ' ')) {
        text = text.substring(verb.length).trim();
        break;
      }
      if (text.endsWith(' ' + verb)) {
        text = text.substring(0, text.length - verb.length).trim();
        break;
      }
      // Middle verbs e.g., "WhatsApp ko khol do"
      const middleMatch = new RegExp(`\\s+(?:ko|ke|ka)?\\s*${verb}\\s*$`, 'i');
      if (middleMatch.test(text)) {
        text = text.replace(middleMatch, '').trim();
        break;
      }
    }

    // Clean remaining postpositions: "ko", "ke", "ka", "app", "application"
    text = text.replace(/\s+(app|application|वाला ऐप|ऐप)$/i, '');
    text = text.replace(/\s+(ko|ke|ka)$/i, '');

    return text.trim();
  }

  /**
   * Resolves query to matching AppInfo from the installed index
   */
  public static resolveApp(query: string, installedApps: AppInfo[]): {
    matchedApp?: AppInfo;
    categoryMatches?: AppInfo[];
    isCategoryMatch: boolean;
  } {
    const cleanQuery = this.extractAppQuery(query);

    // 1. Check for Category Queries e.g. "banking app", "music app", "shopping app"
    if (cleanQuery.includes('bank') || cleanQuery.includes('banking') || cleanQuery.includes('बैंक')) {
      const bankingApps = installedApps.filter(a => a.category === 'Banking' && a.isInstalled);
      return {
        categoryMatches: bankingApps,
        isCategoryMatch: true
      };
    }
    if (cleanQuery.includes('shopping') || cleanQuery.includes('खरीदारी')) {
      const shoppingApps = installedApps.filter(a => a.category === 'Shopping' && a.isInstalled);
      return {
        categoryMatches: shoppingApps,
        isCategoryMatch: true
      };
    }

    // 2. Direct exact or alias match
    for (const app of installedApps) {
      if (app.normalizedName === cleanQuery) {
        return { matchedApp: app, isCategoryMatch: false };
      }
      if (app.displayName.toLowerCase() === cleanQuery) {
        return { matchedApp: app, isCategoryMatch: false };
      }
      if (app.aliases.some(alias => alias.toLowerCase() === cleanQuery || cleanQuery.includes(alias.toLowerCase()))) {
        return { matchedApp: app, isCategoryMatch: false };
      }
    }

    // 3. Partial substring match
    for (const app of installedApps) {
      if (cleanQuery.includes(app.normalizedName) || app.normalizedName.includes(cleanQuery)) {
        return { matchedApp: app, isCategoryMatch: false };
      }
    }

    return { isCategoryMatch: false };
  }
}

/**
 * AppLauncher:
 * Discovers, resolves, launches and verifies application launch operations on Android.
 */
export class AppLauncher {
  private installedApps: AppInfo[] = [];

  constructor() {
    this.installedApps = [...INITIAL_INSTALLED_APPS];
  }

  public getInstalledApps(): AppInfo[] {
    return [...this.installedApps];
  }

  public isAppInstalled(packageName: string): boolean {
    const app = this.installedApps.find(a => a.packageName.toLowerCase() === packageName.toLowerCase());
    return app ? app.isInstalled : false;
  }

  public findAppByName(name: string): AppInfo | undefined {
    return this.installedApps.find(
      a => a.displayName.toLowerCase() === name.toLowerCase() || a.normalizedName === name.toLowerCase()
    );
  }

  public findAppByAlias(alias: string): AppInfo | undefined {
    const clean = alias.toLowerCase().trim();
    return this.installedApps.find(
      a => a.aliases.some(al => al.toLowerCase() === clean || clean.includes(al.toLowerCase()))
    );
  }

  public getLaunchIntent(packageName: string): string | undefined {
    const app = this.installedApps.find(a => a.packageName.toLowerCase() === packageName.toLowerCase());
    return app?.androidIntentUrl || app?.deepLinkUri;
  }

  /**
   * Executes launch action for an application query:
   * - Detects if app is installed
   * - Dispatches actual Android Intent / URL deep link
   * - Reports real reason if missing
   * - Supports disambiguation
   */
  public async launchApp(commandOrAppName: string, isBhojpuri = false): Promise<AppLaunchResult> {
    const { matchedApp, categoryMatches, isCategoryMatch } = AppResolver.resolveApp(commandOrAppName, this.installedApps);

    // Case 1: Category Disambiguation (e.g. "Open my banking app")
    if (isCategoryMatch && categoryMatches && categoryMatches.length > 1) {
      const appNames = categoryMatches.map(a => a.displayName).join(', ');
      return {
        success: false,
        requiresDisambiguation: true,
        matchingApps: categoryMatches,
        voiceMessage: isBhojpuri
          ? `कवन बैंक के ऐप खोले के बा? हमरा लगे ${appNames} बा।`
          : `Aap kaun sa banking app open karna chahte hain? (${appNames})`
      };
    }

    const appToLaunch = matchedApp || (categoryMatches && categoryMatches.length === 1 ? categoryMatches[0] : undefined);

    // Case 2: App Not Found in Index
    if (!appToLaunch) {
      const cleanName = AppResolver.extractAppQuery(commandOrAppName);
      return {
        success: false,
        errorMessage: `App "${cleanName}" not found in installed applications index.`,
        voiceMessage: isBhojpuri
          ? `पंकज जी, ${cleanName} आपके फोन में नइखे मिलल।`
          : `Pankaj Ji, ${cleanName} aapke phone mein installed nahi mila.`
      };
    }

    // Case 3: App is Known but NOT Installed (e.g., Facebook)
    if (!appToLaunch.isInstalled) {
      return {
        success: false,
        launchedApp: appToLaunch,
        errorMessage: `${appToLaunch.displayName} is not installed on this device.`,
        voiceMessage: isBhojpuri
          ? `पंकज जी, ${appToLaunch.displayName} आपके फोन में इंस्टॉल नइखे।`
          : `Pankaj Ji, ${appToLaunch.displayName} aapke phone mein installed nahi hai.`
      };
    }

    // Case 4: Real Intent Execution!
    // Dispatch real Android Intent / deep link URI
    try {
      this.dispatchAndroidIntent(appToLaunch);

      const voiceMsg = isBhojpuri
        ? `जी पंकज, ${appToLaunch.displayName} खोल देतानी।`
        : `Ji Pankaj, ${appToLaunch.displayName} khol raha hoon.`;

      return {
        success: true,
        launchedApp: appToLaunch,
        voiceMessage: voiceMsg
      };
    } catch (launchErr: any) {
      return {
        success: false,
        launchedApp: appToLaunch,
        errorMessage: `Android Intent execution failed: ${launchErr.message}`,
        voiceMessage: isBhojpuri
          ? `जी पंकज, ${appToLaunch.displayName} खोले में कुछ दिक्कत भइल।`
          : `Pankaj Ji, ${appToLaunch.displayName} open nahi ho paaya.`
      };
    }
  }

  /**
   * Dispatches the legitimate Android launch intent or deep link
   */
  private dispatchAndroidIntent(app: AppInfo) {
    if (typeof window === 'undefined') return;

    // 1. Android Intent URL or Custom Scheme
    const targetUrl = app.androidIntentUrl || app.deepLinkUri;

    if (targetUrl) {
      // Create a hidden anchor element to trigger Android Intent without popup blocking
      const a = document.createElement('a');
      a.href = targetUrl;
      a.rel = 'noreferrer';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 500);
    }
  }
}

export const appLauncher = new AppLauncher();

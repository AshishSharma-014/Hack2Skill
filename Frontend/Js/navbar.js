document.addEventListener('DOMContentLoaded', async () => {
  const placeholder = document.getElementById('navbar-placeholder');

  if (placeholder) {
    try {
      const response = await fetch('navbar.html');
      placeholder.innerHTML = await response.text();
    } catch (error) {
      placeholder.innerHTML = '<nav class="navbar"><div class="nav-container"><a class="logo" href="index.html"><span class="logo-text">Jan<span class="logo-accent">Awaaz</span></span></a></div></nav>';
    }
  }

  initNavbar();
  initPageTransitions();
  window.JanAwaazI18n?.apply();
});

function initPageTransitions() {
  if (document.querySelector('.page-transition-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  const startTransition = (event, link) => {
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.hasAttribute('download')) return;

    const targetUrl = new URL(link.href, window.location.href);
    if (targetUrl.origin !== window.location.origin || targetUrl.pathname === window.location.pathname) return;

    event.preventDefault();
    document.body.classList.add('page-transitioning');
    overlay.classList.add('active');

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 260);
  };

  const handleTransitionClick = (event) => {
    const link = event.target.closest('a');
    if (link) {
      startTransition(event, link);
    }
  };

  document.addEventListener('click', handleTransitionClick);

  document.querySelectorAll('a.logo').forEach((logoLink) => {
    logoLink.addEventListener('click', (event) => startTransition(event, logoLink));
  });

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-transitioning');
    overlay.classList.remove('active');
  });

  window.addEventListener('load', () => {
    document.body.classList.remove('page-transitioning');
    overlay.classList.remove('active');
  });
}

const JANAWAAZ_HI_TRANSLATIONS = {
  'Home': 'होम',
  'Track Status': 'स्थिति देखें',
  'Recent Works': 'हाल के कार्य',
  'About': 'परिचय',
  'English': 'अंग्रेजी',
  'Hindi': 'हिंदी',
  'Officer Portal': 'अधिकारी पोर्टल',
  'JanAwaaz | Smart Constituency System': 'जनआवाज | स्मार्ट निर्वाचन क्षेत्र प्रणाली',
  'Track Status | JanAwaaz': 'स्थिति देखें | जनआवाज',
  'Recent Works | JanAwaaz': 'हाल के कार्य | जनआवाज',
  'About JanAwaaz | Smart Constituency System': 'जनआवाज के बारे में | स्मार्ट निर्वाचन क्षेत्र प्रणाली',
  'Officer Login | JanAwaaz': 'अधिकारी लॉगिन | जनआवाज',
  'MP Dashboard | JanAwaaz': 'MP डैशबोर्ड | जनआवाज',
  'JE Field Dashboard | JanAwaaz': 'JE फील्ड डैशबोर्ड | जनआवाज',
  'Toggle menu': 'मेन्यू खोलें या बंद करें',
  'JanAwaaz home': 'जनआवाज होम',
  'AI Constituency Intelligence': 'AI निर्वाचन क्षेत्र इंटेलिजेंस',
  'Raise Your Voice. Build Your Community.': 'अपनी आवाज उठाएं। अपना समुदाय बनाएं।',
  'JanAwaaz converts citizen voices, photos, and locations into ranked development priorities for MPs and verified field tasks for engineers.': 'जनआवाज नागरिकों की आवाज, फोटो और स्थानों को सांसदों के लिए प्राथमिकता वाले विकास कार्यों और इंजीनियरों के लिए सत्यापित फील्ड कार्यों में बदलता है।',
  'Submit a Request': 'अनुरोध जमा करें',
  'Track a Ticket': 'टिकट ट्रैक करें',
  'Platform highlights': 'प्लेटफॉर्म की खास बातें',
  'Voice + Text': 'आवाज + टेक्स्ट',
  'AI Ranking': 'AI रैंकिंग',
  'Field Proof': 'फील्ड प्रमाण',
  'Citizen Request Console': 'नागरिक अनुरोध कंसोल',
  'Tell us what your area needs': 'बताएं आपके क्षेत्र को क्या चाहिए',
  'Submit a complaint or development suggestion. The AI engine will classify, score, and route it.': 'शिकायत या विकास सुझाव जमा करें। AI इंजन इसे वर्गीकृत करेगा, स्कोर देगा और सही जगह भेजेगा।',
  '10-digit mobile number': '10 अंकों का मोबाइल नंबर',
  'Describe the issue or public work needed': 'समस्या या जरूरी सार्वजनिक कार्य लिखें',
  'Ward, colony, village, or landmark': 'वार्ड, कॉलोनी, गांव या पहचान स्थल',
  'Voice': 'आवाज',
  'Record Voice': 'आवाज रिकॉर्ड करें',
  'Photo': 'फोटो',
  'Upload Evidence': 'प्रमाण अपलोड करें',
  'Upload Photo Evidence': 'फोटो प्रमाण अपलोड करें',
  'GPS': 'GPS',
  'Use My Current Location': 'मेरा वर्तमान स्थान उपयोग करें',
  'Submit Request': 'अनुरोध जमा करें',
  'Citizen Input': 'नागरिक इनपुट',
  'Text, voice, photos, and GPS arrive through one fast mobile web flow.': 'टेक्स्ट, आवाज, फोटो और GPS एक तेज मोबाइल वेब फ्लो से आते हैं।',
  'AI Priority Engine': 'AI प्राथमिकता इंजन',
  'Issues are classified and ranked by severity, crowd demand, and public-data multipliers.': 'समस्याओं को गंभीरता, जन मांग और सार्वजनिक डेटा संकेतों के आधार पर वर्गीकृत और रैंक किया जाता है।',
  'Verified Delivery': 'सत्यापित डिलीवरी',
  'MPs forward work to JE dashboards, then before/after proof closes the loop.': 'सांसद कार्य JE डैशबोर्ड पर भेजते हैं, फिर पहले/बाद के प्रमाण से प्रक्रिया पूरी होती है।',
  'Citizen Transparency': 'नागरिक पारदर्शिता',
  'Track Your Request': 'अपना अनुरोध ट्रैक करें',
  'Enter your JanAwaaz ticket ID to see the current lifecycle status.': 'वर्तमान स्थिति देखने के लिए अपना जनआवाज टिकट ID दर्ज करें।',
  'Example: JA-260703-001': 'उदाहरण: JA-260703-001',
  'Public Proof': 'सार्वजनिक प्रमाण',
  'Completed tickets appear here with before/after proof for constituency transparency.': 'पूर्ण टिकट यहां पहले/बाद के प्रमाण के साथ दिखाई देंगे ताकि निर्वाचन क्षेत्र में पारदर्शिता रहे।',
  'Before / After': 'पहले / बाद',
  'No completed works yet': 'अभी कोई कार्य पूरा नहीं हुआ',
  'Mark a JE task completed and it will publish here automatically.': 'JE कार्य को पूरा चिह्नित करें और यह यहां अपने आप प्रकाशित होगा।',
  'Constituency location': 'निर्वाचन क्षेत्र का स्थान',
  'Completed': 'पूर्ण',
  'About JanAwaaz': 'जनआवाज के बारे में',
  'AI infrastructure for listening to every constituency.': 'हर निर्वाचन क्षेत्र को सुनने के लिए AI आधारभूत ढांचा।',
  'MPs receive thousands of requests through letters, meetings, social media, and portals. JanAwaaz turns that noise into ranked, transparent, field-verifiable development action.': 'सांसदों को पत्र, बैठकों, सोशल मीडिया और पोर्टल के माध्यम से हजारों अनुरोध मिलते हैं। जनआवाज उस शोर को रैंक किए हुए, पारदर्शी और फील्ड-सत्यापित विकास कार्यों में बदलता है।',
  'Input': 'इनपुट',
  'Citizen Web App': 'नागरिक वेब ऐप',
  'People submit issues through text, voice, photos, and GPS without downloading an app.': 'लोग ऐप डाउनलोड किए बिना टेक्स्ट, आवाज, फोटो और GPS से समस्याएं जमा करते हैं।',
  'Brain': 'दिमाग',
  'AI Processing': 'AI प्रोसेसिंग',
  'The backend classifies category, severity, demand, and demographic priority into a clean JSON ticket.': 'बैकेंड श्रेणी, गंभीरता, मांग और जनसांख्यिकीय प्राथमिकता को साफ JSON टिकट में वर्गीकृत करता है।',
  'Output': 'आउटपुट',
  'Role Dashboards': 'भूमिका डैशबोर्ड',
  'MPs see a priority queue and heatmap. JEs receive field tasks with photo proof and budget inputs.': 'सांसद प्राथमिकता कतार और हीटमैप देखते हैं। JE को फोटो प्रमाण और बजट इनपुट के साथ फील्ड कार्य मिलते हैं।',
  'Secret Sauce': 'मुख्य तरीका',
  'Priority Score = AI Severity x Crowd Demand x Demographic Multiplier': 'प्राथमिकता स्कोर = AI गंभीरता x जन मांग x जनसांख्यिकीय गुणक',
  'A missing school in an underserved village should outrank a single low-impact request. JanAwaaz combines citizen demand with public-data signals so decisions are objective and explainable.': 'वंचित गांव में स्कूल की कमी को एक कम प्रभाव वाले अनुरोध से अधिक प्राथमिकता मिलनी चाहिए। जनआवाज नागरिक मांग को सार्वजनिक डेटा संकेतों से जोड़ता है ताकि निर्णय वस्तुनिष्ठ और समझाने योग्य हों।',
  'AI Severity': 'AI गंभीरता',
  'Crowd Demand': 'जन मांग',
  'Public Dataset Boost': 'सार्वजनिक डेटा बढ़त',
  'Transparent Ticket Lifecycle': 'पारदर्शी टिकट जीवनचक्र',
  'NEW': 'नया',
  'VERIFICATION PENDING': 'सत्यापन लंबित',
  'VERIFIED': 'सत्यापित',
  'IN PROGRESS': 'प्रगति में',
  'COMPLETED': 'पूर्ण',
  'Officer Login': 'अधिकारी लॉगिन',
  'Secure access for constituency officers': 'निर्वाचन क्षेत्र अधिकारियों के लिए सुरक्षित प्रवेश',
  'Mobile Number': 'मोबाइल नंबर',
  'Enter 10-digit number': '10 अंकों का नंबर दर्ज करें',
  'Send OTP': 'OTP भेजें',
  'Enter OTP': 'OTP दर्ज करें',
  'Code sent to': 'कोड भेजा गया',
  'Invalid OTP. Please try again.': 'गलत OTP। कृपया फिर कोशिश करें।',
  'Verify & Login': 'सत्यापित करें और लॉगिन करें',
  "Didn't receive the code?": 'कोड नहीं मिला?',
  'Resend OTP': 'OTP फिर भेजें',
  '← Change number': '← नंबर बदलें',
  'District Overview': 'जिला अवलोकन',
  '— AI Priority Engine': '— AI प्राथमिकता इंजन',
  'Real-time constituency insights, ranked by urgency': 'तत्कालता के अनुसार रैंक की गई वास्तविक समय निर्वाचन क्षेत्र जानकारी',
  'Live Data': 'लाइव डेटा',
  'Total Requests': 'कुल अनुरोध',
  'Critical Alerts': 'गंभीर अलर्ट',
  'Pending Verifications': 'लंबित सत्यापन',
  'AI Priority Queue': 'AI प्राथमिकता कतार',
  'Sorted by AI Score': 'AI स्कोर के अनुसार क्रमबद्ध',
  'Issue Type': 'समस्या प्रकार',
  'Location': 'स्थान',
  'Demand': 'मांग',
  'AI Score': 'AI स्कोर',
  'Status': 'स्थिति',
  'Action': 'कार्रवाई',
  'Issue Heatmap': 'समस्या हीटमैप',
  'By Ward': 'वार्ड के अनुसार',
  'Map visualization loading...': 'मैप विजुअलाइजेशन लोड हो रहा है...',
  'Constituency ward-level heatmap': 'निर्वाचन क्षेत्र वार्ड-स्तरीय हीटमैप',
  'Field Tasks': 'फील्ड कार्य',
  'Assigned verification & resolution tasks': 'सौंपे गए सत्यापन और समाधान कार्य',
  'No active JE tasks': 'कोई सक्रिय JE कार्य नहीं',
  'Forward requests from the MP dashboard and they will appear here.': 'MP डैशबोर्ड से अनुरोध भेजें और वे यहां दिखाई देंगे।',
  'Location pending': 'स्थान लंबित',
  'Upload Field Photo (Before/After)': 'फील्ड फोटो अपलोड करें (पहले/बाद)',
  'Tap to upload photo': 'फोटो अपलोड करने के लिए टैप करें',
  'Estimated Budget (Rs)': 'अनुमानित बजट (रु)',
  'Rs': 'रु',
  'Enter estimated amount': 'अनुमानित राशि दर्ज करें',
  'Field Remarks': 'फील्ड टिप्पणी',
  'Enter observations from the field visit...': 'फील्ड विजिट की टिप्पणियां दर्ज करें...',
  'Submit Verification': 'सत्यापन जमा करें',
  'Mark Completed': 'पूर्ण चिह्नित करें',
  'Roads': 'सड़कें',
  'Road': 'सड़क',
  'Water': 'पानी',
  'Health': 'स्वास्थ्य',
  'Education': 'शिक्षा',
  'School': 'स्कूल',
  'Street Lighting': 'स्ट्रीट लाइटिंग',
  'Light': 'लाइट',
  'Sanitation': 'स्वच्छता',
  'Clean': 'स्वच्छ',
  'Civic': 'नागरिक',
  'Repair broken main road and potholes': 'टूटी मुख्य सड़क और गड्ढों की मरम्मत',
  'Fix leaking water pipeline': 'लीक हो रही पानी पाइपलाइन ठीक करें',
  'Install lights near Gandhi Chowk': 'गांधी चौक के पास लाइट लगाएं',
  'Four poles required; wiring access available.': 'चार खंभों की जरूरत है; वायरिंग पहुंच उपलब्ध है।',
  'Ward 12, MG Road': 'वार्ड 12, एमजी रोड',
  'Ward 7, Nehru Nagar': 'वार्ड 7, नेहरू नगर',
  'Ward 3, Gandhi Chowk': 'वार्ड 3, गांधी चौक',
  'Forward to JE': 'JE को भेजें',
  'Forwarded': 'भेजा गया',
  'Forwarding...': 'भेजा जा रहा है...',
  'Loading ticket...': 'टिकट लोड हो रहा है...',
  'Ticket not found. Try a freshly submitted ID or JA-260703-001.': 'टिकट नहीं मिला। नया जमा किया गया ID या JA-260703-001 आजमाएं।',
  'Submitting...': 'जमा हो रहा है...',
  'Completing...': 'पूरा किया जा रहा है...',
  'Submitted': 'जमा हुआ',
  'Listening...': 'सुना जा रहा है...',
  'Sending...': 'भेजा जा रहा है...',
  'Verifying...': 'सत्यापित हो रहा है...',
  'Verified': 'सत्यापित',
  'Resending...': 'फिर भेजा जा रहा है...',
  'Enter a valid 10-digit mobile number.': 'मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।',
  'Invalid OTP. Use 1234 for this MVP demo.': 'गलत OTP। इस MVP डेमो के लिए 1234 उपयोग करें।',
  'Voice capture is not supported in this browser. You can type the complaint instead.': 'इस ब्राउजर में आवाज कैप्चर समर्थित नहीं है। आप शिकायत टाइप कर सकते हैं।',
  'GPS is unavailable. Please type the ward or landmark.': 'GPS उपलब्ध नहीं है। कृपया वार्ड या पहचान स्थल लिखें।',
  'Fetching your current location...': 'आपका वर्तमान स्थान लिया जा रहा है...',
  'Unable to fetch GPS. You can still submit with a written location.': 'GPS नहीं मिल सका। आप लिखे हुए स्थान के साथ भी जमा कर सकते हैं।',
  'Please enter a valid 10-digit mobile number.': 'कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।',
  'Please describe the issue in a little more detail.': 'कृपया समस्या को थोड़ा और विस्तार से लिखें।',
  'Submission failed.': 'जमा करना असफल रहा।',
  'AI category:': 'AI श्रेणी:',
  'Priority score:': 'प्राथमिकता स्कोर:',
  'Track ID:': 'ट्रैक ID:',
  'Saved Demo Request': 'डेमो अनुरोध सेव हुआ',
  'Start the backend with npm run dev inside Backend.': 'Backend के अंदर npm run dev से बैकेंड शुरू करें।',
  'Unable to load JE tasks': 'JE कार्य लोड नहीं हो सके',
  'Unable to load complaints': 'शिकायतें लोड नहीं हो सकीं',
  'Forward failed': 'भेजना असफल रहा',
  'Update failed': 'अपडेट असफल रहा',
  'Unable to load works': 'कार्य लोड नहीं हो सके',
  'Ticket not found': 'टिकट नहीं मिला'
};

const janAwaazOriginalText = new WeakMap();
const janAwaazOriginalAttrs = new WeakMap();
let janAwaazOriginalTitle = '';

function normalizeI18nText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function preserveEdgeSpace(original, translated) {
  const start = String(original).match(/^\s*/)[0];
  const end = String(original).match(/\s*$/)[0];
  return `${start}${translated}${end}`;
}

function translateJanAwaazText(value) {
  const text = normalizeI18nText(value);
  if (!text) return text;
  if (JANAWAAZ_HI_TRANSLATIONS[text]) return JANAWAAZ_HI_TRANSLATIONS[text];

  if (/^AI Score \d+$/.test(text)) return text.replace('AI Score', 'AI स्कोर');
  if (/^AI: \d+$/.test(text)) return text.replace('AI:', 'AI:');
  if (/^Pin .+/.test(text)) return text.replace(/^Pin/, 'पिन');
  if (/^Location captured:/.test(text)) return text.replace('Location captured:', 'स्थान कैप्चर हुआ:');
  if (/^Submitted:/.test(text)) return text.replace('Submitted:', 'जमा हुआ:');
  if (/^AI category: (.+)\. Priority score: (.+)\. Track ID: (.+)$/.test(text)) {
    return text.replace(/^AI category:/, 'AI श्रेणी:')
      .replace('. Priority score:', '. प्राथमिकता स्कोर:')
      .replace('. Track ID:', '. ट्रैक ID:');
  }

  return text;
}

function applyJanAwaazLanguage(lang = localStorage.getItem('janawaaz-lang') || 'EN') {
  const useHindi = lang === 'HI';
  document.documentElement.lang = useHindi ? 'hi' : 'en';
  if (!janAwaazOriginalTitle) janAwaazOriginalTitle = document.title;
  document.title = useHindi ? translateJanAwaazText(janAwaazOriginalTitle) : janAwaazOriginalTitle;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!normalizeI18nText(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest('script, style, input, textarea')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    if (!janAwaazOriginalText.has(node)) janAwaazOriginalText.set(node, node.nodeValue);
    const original = janAwaazOriginalText.get(node);
    node.nodeValue = useHindi
      ? preserveEdgeSpace(original, translateJanAwaazText(original))
      : original;
  });

  document.querySelectorAll('[placeholder], [aria-label], [title]').forEach(element => {
    if (!janAwaazOriginalAttrs.has(element)) janAwaazOriginalAttrs.set(element, {});
    const originals = janAwaazOriginalAttrs.get(element);

    ['placeholder', 'aria-label', 'title'].forEach(attr => {
      if (!element.hasAttribute(attr)) return;
      if (!originals[attr]) originals[attr] = element.getAttribute(attr);
      const original = originals[attr];
      element.setAttribute(attr, useHindi ? translateJanAwaazText(original) : original);
    });
  });

  const label = document.getElementById('langLabel');
  if (label) label.textContent = lang;
}

window.JanAwaazI18n = {
  apply: applyJanAwaazLanguage,
  current: () => localStorage.getItem('janawaaz-lang') || 'EN',
  t: value => (localStorage.getItem('janawaaz-lang') === 'HI' ? translateJanAwaazText(value) : value)
};

function getPreferredVoice(language) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const langPrefix = language === 'HI' ? 'hi' : 'en';
  const preferredNames = ['Samantha', 'Karen', 'Zira', 'Alex', 'Google US English', 'Microsoft David', 'Microsoft Zira', 'Daniel'];

  const exactVoice = voices.find(voice => voice.lang.toLowerCase().startsWith(langPrefix) && preferredNames.some(name => voice.name.includes(name)));
  if (exactVoice) return exactVoice;

  const fallbackVoice = voices.find(voice => voice.lang.toLowerCase().startsWith(langPrefix));
  return fallbackVoice || null;
}

function getSpeakableText() {
  const contentRoot = document.querySelector('main')
    || document.querySelector('.page')
    || document.querySelector('.status-page')
    || document.querySelector('.works-page')
    || document.querySelector('.about-page')
    || document.querySelector('.dashboard')
    || document.querySelector('.je-page')
    || document.querySelector('.login-page')
    || document.body;

  const walker = document.createTreeWalker(contentRoot, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest('.navbar, .nav-links, .nav-actions, .lang-switcher, .hamburger, script, style, textarea, input, select, noscript')) return NodeFilter.FILTER_REJECT;
      const style = window.getComputedStyle(parent);
      if (style.display === 'none' || style.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const chunks = [];
  while (walker.nextNode()) {
    const cleaned = walker.currentNode.nodeValue.replace(/\s+/g, ' ').trim();
    if (cleaned) chunks.push(cleaned);
  }

  return chunks.join(' ').slice(0, 2000) || document.title;
}

function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navActions = document.getElementById('navActions');
  const langSwitcher = document.querySelector('.lang-switcher');
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langLabel = document.getElementById('langLabel');
  const speakBtn = document.getElementById('speakBtn');

  if (!hamburger || !navLinks || !navActions) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === currentPage);
  });

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navActions.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', isOpen);
    navActions.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  if (langBtn && langSwitcher && langDropdown && langLabel) {
    langBtn.addEventListener('click', event => {
      event.stopPropagation();
      const isOpen = langSwitcher.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', String(isOpen));
    });

    langDropdown.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        const selectedLang = item.dataset.lang;
        langLabel.textContent = selectedLang;
        langSwitcher.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
        localStorage.setItem('janawaaz-lang', selectedLang);
        window.JanAwaazI18n.apply(selectedLang);
        window.dispatchEvent(new CustomEvent('janawaaz:languagechange', { detail: { lang: selectedLang } }));
      });
    });

    langLabel.textContent = localStorage.getItem('janawaaz-lang') || 'EN';

    document.addEventListener('click', event => {
      if (!langSwitcher.contains(event.target)) {
        langSwitcher.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      const speech = window.speechSynthesis;
      if (!speech) {
        alert('Text-to-speech is not supported in this browser.');
        return;
      }

      if (speech.speaking) {
        speech.cancel();
        speakBtn.querySelector('.speak-text').textContent = 'Speak';
        return;
      }

      const speechText = getSpeakableText();
      const utterance = new SpeechSynthesisUtterance(speechText);
      const language = localStorage.getItem('janawaaz-lang') === 'HI' ? 'HI' : 'EN';
      utterance.lang = language === 'HI' ? 'hi-IN' : 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.voice = getPreferredVoice(language);
      utterance.onend = () => {
        speakBtn.querySelector('.speak-text').textContent = 'Speak';
      };
      speech.cancel();
      speech.speak(utterance);
      speakBtn.querySelector('.speak-text').textContent = 'Stop';
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

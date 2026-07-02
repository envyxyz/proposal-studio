// Live page list read directly from the DOM to respect drag-and-drop page reordering
let pages = [...document.querySelectorAll('.page')];
const nav = document.getElementById('pageNav');

// Rebuilds the tab navigation menu based on current visibility & order of pages
function rebuildNav() {
  pages = [...document.querySelectorAll('.page')];
  nav.innerHTML = '';
  const currentlyActive = pages.find(p => p.classList.contains('active') && !p.classList.contains('page-disabled'));
  let firstVisibleSet = false;

  pages.forEach(p => {
    if (p.classList.contains('page-disabled')) {
      p.classList.remove('active');
      return;
    }
    const btn = document.createElement('button');
    btn.className = 'page-tab';
    btn.textContent = p.dataset.page.replace(/-/g, ' ');
    const shouldBeActive = currentlyActive ? p === currentlyActive : !firstVisibleSet;
    if (shouldBeActive) {
      btn.classList.add('active');
      pages.forEach(pg => pg.classList.remove('active'));
      p.classList.add('active');
      firstVisibleSet = true;
    }
    btn.onclick = () => {
      pages.forEach(pg => pg.classList.remove('active'));
      [...nav.children].forEach(b => b.classList.remove('active'));
      p.classList.add('active');
      btn.classList.add('active');
    };
    nav.appendChild(btn);
  });

  // Fallback to activate the first available page if none set active
  if (!firstVisibleSet) {
    const firstVisible = pages.find(p => !p.classList.contains('page-disabled'));
    if (firstVisible) {
      firstVisible.classList.add('active');
      nav.firstElementChild && nav.firstElementChild.classList.add('active');
    }
  }
}

rebuildNav();

// ============ WELCOME PAGE DYNAMIC ROWS ============
const welcomeContainer = document.getElementById('welcomeRows');

function makeWelcomeRow(title, bodyHTML) {
  const row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = `
    <div class="h-section" contenteditable="true" data-placeholder="SECTION NAME">${title}</div>
    <div class="row-body">
      <div contenteditable="true" data-placeholder="Section content…">${bodyHTML}</div>
      <button class="remove-row-btn">Remove</button>
    </div>
  `;
  row.querySelector('.remove-row-btn').onclick = () => row.remove();
  return row;
}

document.getElementById('addWelcomeRow').onclick = () => {
  welcomeContainer.appendChild(makeWelcomeRow('NEW SECTION', '<ul><li>Detail point</li></ul>'));
};

// Seed default welcome rows on load
welcomeContainer.appendChild(makeWelcomeRow(
  'CLIENT EXPERIENCE',
  'To keep everything smooth, organized, and transparent, you\'ll have access to a dedicated client portal covering project overview, timeline, communication, and deliverables.'
));
welcomeContainer.appendChild(makeWelcomeRow(
  'HOW WE WORK',
  '<ul><li>Clear scope defined before moving forward to avoid revisions and delays</li><li>Regular updates to keep everyone informed</li><li>Focus on quality, performance, and user experience</li></ul>'
));
welcomeContainer.appendChild(makeWelcomeRow(
  'CLIENT RESPONSIBILITIES',
  '<ul><li>Provide all required content, assets, and access</li><li>Give timely feedback and approvals</li><li>Respect project timelines and scope</li></ul>'
));
welcomeContainer.appendChild(makeWelcomeRow(
  'NEXT STEPS',
  '<ul><li>Review and approve the agreement</li><li>Provide required assets (content, images, access, etc.)</li><li>Let\'s build something great!</li></ul>'
));

// ============ SERVICE SCOPE ROWS ============
const scopeContainer = document.getElementById('scopeRows');

function makeScopeRow(title, desc, price) {
  const row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = `
    <div class="h-section" contenteditable="true" data-placeholder="SERVICE NAME">${title}</div>
    <div class="row-body">
      <div contenteditable="true" data-placeholder="Service description...">${desc}</div>
      <div class="label-mono" style="margin-top:10px;" contenteditable="true" data-placeholder="$0 / Timeline">${price}</div>
      <button class="remove-row-btn">Remove</button>
    </div>
  `;
  row.querySelector('.remove-row-btn').onclick = () => row.remove();
  return row;
}

document.getElementById('addScopeRow').onclick = () => {
  scopeContainer.appendChild(makeScopeRow('NEW SERVICE', 'Describe what this service includes.', '$0 — Timeline'));
};

scopeContainer.appendChild(makeScopeRow('WEB DESIGN', 'Custom Shopify theme design tailored to your brand, fully responsive across devices.', '$0 — 2 Weeks'));

// ============ ADDITIONAL SERVICES ROWS ============
const additionalContainer = document.getElementById('additionalRows');

function makeAdditionalRow(name, price, desc) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="svc-name" contenteditable="true" data-placeholder="SERVICE NAME">${name}</td>
    <td class="svc-price" contenteditable="true" data-placeholder="PRICE / TERMS">${price}</td>
    <td class="svc-desc" contenteditable="true" data-placeholder="Service description...">${desc}</td>
    <td class="row-controls"><button class="remove-row-btn">✕</button></td>
  `;
  tr.querySelector('.remove-row-btn').onclick = () => tr.remove();
  return tr;
}

document.getElementById('addAdditionalRow').onclick = () => {
  additionalContainer.appendChild(makeAdditionalRow('NEW SERVICE', 'PRICE / MONTH', 'Describe what this service includes.'));
};

additionalContainer.appendChild(makeAdditionalRow('FULL-SCALE SEO', '£180 / MONTH', 'Comprehensive search engine optimization across your entire store, targeting category and local keywords to grow organic traffic.'));
additionalContainer.appendChild(makeAdditionalRow('POS & INVENTORY MANAGEMENT', '£99 ( £50 SETUP + £49 / MONTH )', 'A Shopify point-of-sale solution configured for your store, with monthly inventory management and reporting. Covers up to 15 active listings.'));
additionalContainer.appendChild(makeAdditionalRow('COMPLETE STORE MANAGEMENT', 'CONTACT FOR PRICING', 'End-to-end management of your online store: listings, content, promotions, and platform upkeep. Logistics excluded. Quoted per business based on scope.'));
additionalContainer.appendChild(makeAdditionalRow('EBAY / ETSY VA SERVICES', 'CONTACT FOR PRICING', 'Expand beyond your Shopify store. We manage your eBay or Etsy listings, content, and customer-facing operations entirely. Logistics excluded. Charged monthly.'));

// ============ WEBSITE GUIDE DYNAMIC ROWS ============
const guideContainer = document.getElementById('guideRows');

function makeGuideRow(title, bodyHTML) {
  const row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = `
    <div class="h-section" contenteditable="true" data-placeholder="SECTION NAME">${title}</div>
    <div class="row-body">
      <div contenteditable="true" data-placeholder="Section content…">${bodyHTML}</div>
      <button class="remove-row-btn">Remove</button>
    </div>
  `;
  row.querySelector('.remove-row-btn').onclick = () => row.remove();
  return row;
}

document.getElementById('addGuideRow').onclick = () => {
  guideContainer.appendChild(makeGuideRow('NEW SECTION', '<ul><li>Detail point</li></ul>'));
};

// Seed default guide rows on load
guideContainer.appendChild(makeGuideRow(
  'OVERVIEW',
  'Your website has been built with performance, scalability, and user experience in mind. It is fully optimized and ready to support your business goals.'
));
guideContainer.appendChild(makeGuideRow(
  'MAINTENANCE',
  'To ensure optimal performance over time:<ul><li>Regularly update your content</li><li>Monitor for any technical issues</li><li>Keep integrations and forms up to date</li></ul>Ongoing maintenance services can be provided upon request.'
));
guideContainer.appendChild(makeGuideRow(
  'CONTENT MANAGEMENT',
  'You can update your website content at any time, including text and images, blog posts or dynamic content, and basic page edits.<br><br>For major changes (structure, design, new features), it is recommended to contact the developer.'
));

// ============ INVOICE ROWS ============
const invoiceBody = document.getElementById('invoiceRows');

// ============ CURRENCY ============
let currencySymbol = '$';

function currency(n) {
  return currencySymbol + (isNaN(n) ? 0 : n).toFixed(2);
}

function recalcInvoice() {
  let subtotal = 0;
  [...invoiceBody.children].forEach(tr => {
    const qty = parseFloat(tr.querySelector('.f-qty').textContent) || 0;
    const price = parseFloat(tr.querySelector('.f-price').textContent.replace(/[^0-9.]/g, '')) || 0;
    const total = qty * price;
    tr.querySelector('.f-total').textContent = currency(total);
    subtotal += total;
  });
  const taxRate = parseFloat(document.getElementById('taxRate').textContent) || 0;
  const tax = subtotal * (taxRate / 100);
  document.getElementById('subtotalVal').textContent = currency(subtotal);
  document.getElementById('taxVal').textContent = currency(tax);
  document.getElementById('grandVal').textContent = currency(subtotal + tax);
}

function makeInvoiceRow(title, desc, qty, price) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <div class="item-title" contenteditable="true" data-placeholder="Item name">${title}</div>
      <div class="item-desc" contenteditable="true" data-placeholder="Short description">${desc}</div>
    </td>
    <td class="num f-qty" contenteditable="true" data-placeholder="1">${qty}</td>
    <td class="num f-price" contenteditable="true" data-placeholder="0.00">${price}</td>
    <td class="num f-total">${currency(qty * parseFloat(price) || 0)}</td>
    <td class="row-controls"><button class="remove-row-btn">✕</button></td>
  `;
  tr.querySelector('.remove-row-btn').onclick = () => { tr.remove(); recalcInvoice(); };
  tr.querySelectorAll('.f-qty, .f-price').forEach(el => {
    el.addEventListener('input', recalcInvoice);
    el.addEventListener('blur', recalcInvoice);
  });
  return tr;
}

document.getElementById('addInvoiceRow').onclick = () => {
  invoiceBody.appendChild(makeInvoiceRow('New Item', 'Description', 1, '0.00'));
  recalcInvoice();
};

document.getElementById('taxRate').addEventListener('input', recalcInvoice);
document.getElementById('taxRate').addEventListener('blur', recalcInvoice);

// Seed dynamic default row
invoiceBody.appendChild(makeInvoiceRow('Web Design & Development', 'Full Shopify store build', 1, '450.00'));
recalcInvoice();

// ============ LOGO / MARK ============
const marks = [...document.querySelectorAll('.mark')];
const DEFAULT_MARK = '✝';

function syncMarks(html, exceptEl) {
  marks.forEach(m => { if (m !== exceptEl) m.innerHTML = html; });
}

marks.forEach(m => {
  m.addEventListener('input', () => syncMarks(m.innerHTML, m));
});

document.getElementById('logoUploadBtn').onclick = () => {
  document.getElementById('logoUpload').click();
};

document.getElementById('logoUpload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    syncMarks(`<img src="${reader.result}" alt="logo">`, null);
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});

// ============ QR CODE UPLOAD & SOFT-DELETE ============
const qrWrapper = document.getElementById('qrWrapper');
const qrBox = document.getElementById('qrBox');
const qrUpload = document.getElementById('qrUpload');
const qrCloseBtn = document.getElementById('qrCloseBtn');
const qrRestoreBtn = document.getElementById('qrRestoreBtn');

qrBox.addEventListener('click', (e) => {
  e.stopPropagation();
  qrUpload.click();
});
qrUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const label = document.getElementById('qrBoxLabel');
    if (label) label.remove();
    let img = qrBox.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      qrBox.insertBefore(img, qrBox.querySelector('.qr-hint'));
    }
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});

qrCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  qrWrapper.classList.add('qr-hidden');
});

qrRestoreBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  qrWrapper.classList.remove('qr-hidden');
});

// ============ PAYMENT METHODS ============
const paymentMethodsContainer = document.getElementById('paymentMethods');

function makePaymentMethod(name, details) {
  const div = document.createElement('div');
  div.className = 'pay-method';
  div.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
      <b contenteditable="true" data-placeholder="Payment Method">${name}</b>
      <button class="remove-pay-btn" style="background: none; border: none; color: #B33A2E; cursor: pointer; font-size: 11px; font-weight: bold; line-height: 1; padding: 2px 5px; opacity: 0; transition: opacity .15s;" title="Remove Payment Method">✕</button>
    </div>
    <span class="collapsible" contenteditable="true" data-placeholder="[ Account details ]">${details}</span>
  `;
  div.querySelector('.remove-pay-btn').onclick = () => div.remove();
  return div;
}

document.getElementById('addPaymentMethod').onclick = () => {
  paymentMethodsContainer.appendChild(makePaymentMethod('NEW PAYMENT METHOD', '[ Account details ]'));
};

// Seed defaults
paymentMethodsContainer.appendChild(makePaymentMethod('Bank Transfer', '[ Account details ]'));
paymentMethodsContainer.appendChild(makePaymentMethod('PayPal / Wise', '[ Account details ]'));

// ============ DESIGN SETTINGS ============
const settingsPanel = document.getElementById('settingsPanel');
const designToggleBtn = document.getElementById('designToggle');

designToggleBtn.onclick = () => {
  settingsPanel.classList.toggle('open');
  document.getElementById('pageManager').classList.remove('open');
};

document.addEventListener('click', (e) => {
  if (!settingsPanel.classList.contains('open')) return;
  if (settingsPanel.contains(e.target) || designToggleBtn.contains(e.target)) return;
  settingsPanel.classList.remove('open');
});

/* Write design tokens to .canvas-wrap so changes never escape into the shell UI */
const canvasWrap = document.querySelector('.canvas-wrap');
const rootStyle = canvasWrap.style;
const fontSelect = document.getElementById('fontSelect');
const headingFontSelect = document.getElementById('headingFontSelect');
const bodyWeightSelect = document.getElementById('bodyWeightSelect');
const headingWeightSelect = document.getElementById('headingWeightSelect');
const textColorPicker = document.getElementById('textColorPicker');
const titleColorPicker = document.getElementById('titleColorPicker');
const headingColorPicker = document.getElementById('headingColorPicker');
const accentColorPicker = document.getElementById('accentColorPicker');
const dividerColorPicker = document.getElementById('dividerColorPicker');
const bgColorPicker = document.getElementById('bgColorPicker');
const titleSizeSelect = document.getElementById('titleSizeSelect');
const headingSizeSelect = document.getElementById('headingSizeSelect');
const bodySizeSelect = document.getElementById('bodySizeSelect');
const letterSpacingSelect = document.getElementById('letterSpacingSelect');
const lineSpacingSelect = document.getElementById('lineSpacingSelect');
const dividerSpacingSelect = document.getElementById('dividerSpacingSelect');
const currencySelect = document.getElementById('currencySelect');

const DEFAULT_SETTINGS = {
  font: "'Inter',sans-serif",
  headingFont: "'Archivo Black',sans-serif",
  bodyWeight: '400',
  headingWeight: '400',
  text: '#18140F',
  titleColor: '#18140F',
  headingColor: '#18140F',
  accentColor: '#18140F',
  dividerColor: '#DAD2C4',
  bg: '#F5F0E8',
  titleSize: '1',
  headingSize: '1',
  bodySize: '1',
  letterSpacing: '1',
  lineSpacing: '1',
  dividerSpacing: '1',
  currency: '$'
};

const loadedGoogleFonts = new Set();

function loadGoogleFont(familyName) {
  if (loadedGoogleFonts.has(familyName)) return;
  const linkEl = document.createElement('link');
  linkEl.rel = 'stylesheet';
  linkEl.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familyName).replace(/%20/g, '+')}:wght@400;500;600;700;900&display=swap`;
  document.head.appendChild(linkEl);
  loadedGoogleFonts.add(familyName);
}

function promptCustomFont(selectEl, cssVarName, isHeading) {
  const familyName = prompt('Enter a Google Font name (e.g. "Barlow Condensed"):');
  if (!familyName) {
    selectEl.value = isHeading ? DEFAULT_SETTINGS.headingFont : DEFAULT_SETTINGS.font;
    return;
  }
  loadGoogleFont(familyName);
  const cssValue = `'${familyName}',sans-serif`;
  const opt = document.createElement('option');
  opt.value = cssValue;
  opt.textContent = familyName;
  selectEl.insertBefore(opt, selectEl.lastElementChild);
  selectEl.value = cssValue;
  rootStyle.setProperty(cssVarName, cssValue);
}

fontSelect.addEventListener('change', e => {
  if (e.target.value === '__custom__') { promptCustomFont(fontSelect, '--font-body', false); return; }
  rootStyle.setProperty('--font-body', e.target.value);
});
headingFontSelect.addEventListener('change', e => {
  if (e.target.value === '__custom__') { promptCustomFont(headingFontSelect, '--font-heading', true); return; }
  rootStyle.setProperty('--font-heading', e.target.value);
});
bodyWeightSelect.addEventListener('change', e => {
  rootStyle.setProperty('--font-weight-body', e.target.value);
});
headingWeightSelect.addEventListener('change', e => {
  rootStyle.setProperty('--font-weight-heading', e.target.value);
});
textColorPicker.addEventListener('input', e => {
  rootStyle.setProperty('--black', e.target.value);
});
titleColorPicker.addEventListener('input', e => {
  rootStyle.setProperty('--title-color', e.target.value);
});
headingColorPicker.addEventListener('input', e => {
  rootStyle.setProperty('--heading-color', e.target.value);
});
accentColorPicker.addEventListener('input', e => {
  rootStyle.setProperty('--accent-color', e.target.value);
});
dividerColorPicker.addEventListener('input', e => {
  rootStyle.setProperty('--divider-color', e.target.value);
});
bgColorPicker.addEventListener('input', e => {
  rootStyle.setProperty('--paper', e.target.value);
});
titleSizeSelect.addEventListener('change', e => {
  rootStyle.setProperty('--title-size-scale', e.target.value);
});
headingSizeSelect.addEventListener('change', e => {
  rootStyle.setProperty('--heading-size-scale', e.target.value);
});
bodySizeSelect.addEventListener('change', e => {
  rootStyle.setProperty('--body-size-scale', e.target.value);
});
letterSpacingSelect.addEventListener('change', e => {
  rootStyle.setProperty('--letter-spacing-scale', e.target.value);
});
lineSpacingSelect.addEventListener('change', e => {
  rootStyle.setProperty('--line-spacing-scale', e.target.value);
});
dividerSpacingSelect.addEventListener('change', e => {
  rootStyle.setProperty('--divider-spacing-scale', e.target.value);
});
currencySelect.addEventListener('change', e => {
  if (e.target.value === '__custom__') {
    const custom = prompt('Enter custom currency symbol (e.g. "kr", "₱", "₩"):');
    if (!custom) { currencySelect.value = currencySymbol; return; }
    const opt = document.createElement('option');
    opt.value = custom;
    opt.textContent = custom + ' — Custom';
    currencySelect.insertBefore(opt, currencySelect.lastElementChild);
    currencySelect.value = custom;
    currencySymbol = custom;
  } else {
    currencySymbol = e.target.value;
  }
  recalcInvoice();
});

document.getElementById('settingsReset').onclick = () => {
  rootStyle.setProperty('--font-body', DEFAULT_SETTINGS.font);
  rootStyle.setProperty('--font-heading', DEFAULT_SETTINGS.headingFont);
  rootStyle.setProperty('--font-weight-body', DEFAULT_SETTINGS.bodyWeight);
  rootStyle.setProperty('--font-weight-heading', DEFAULT_SETTINGS.headingWeight);
  rootStyle.setProperty('--black', DEFAULT_SETTINGS.text);
  rootStyle.setProperty('--title-color', DEFAULT_SETTINGS.titleColor);
  rootStyle.setProperty('--heading-color', DEFAULT_SETTINGS.headingColor);
  rootStyle.setProperty('--accent-color', DEFAULT_SETTINGS.accentColor);
  rootStyle.setProperty('--divider-color', DEFAULT_SETTINGS.dividerColor);
  rootStyle.setProperty('--paper', DEFAULT_SETTINGS.bg);
  rootStyle.setProperty('--title-size-scale', DEFAULT_SETTINGS.titleSize);
  rootStyle.setProperty('--heading-size-scale', DEFAULT_SETTINGS.headingSize);
  rootStyle.setProperty('--body-size-scale', DEFAULT_SETTINGS.bodySize);
  rootStyle.setProperty('--letter-spacing-scale', DEFAULT_SETTINGS.letterSpacing);
  rootStyle.setProperty('--line-spacing-scale', DEFAULT_SETTINGS.lineSpacing);
  rootStyle.setProperty('--divider-spacing-scale', DEFAULT_SETTINGS.dividerSpacing);
  fontSelect.value = DEFAULT_SETTINGS.font;
  headingFontSelect.value = DEFAULT_SETTINGS.headingFont;
  bodyWeightSelect.value = DEFAULT_SETTINGS.bodyWeight;
  headingWeightSelect.value = DEFAULT_SETTINGS.headingWeight;
  textColorPicker.value = DEFAULT_SETTINGS.text;
  titleColorPicker.value = DEFAULT_SETTINGS.titleColor;
  headingColorPicker.value = DEFAULT_SETTINGS.headingColor;
  accentColorPicker.value = DEFAULT_SETTINGS.accentColor;
  dividerColorPicker.value = DEFAULT_SETTINGS.dividerColor;
  bgColorPicker.value = DEFAULT_SETTINGS.bg;
  titleSizeSelect.value = DEFAULT_SETTINGS.titleSize;
  headingSizeSelect.value = DEFAULT_SETTINGS.headingSize;
  bodySizeSelect.value = DEFAULT_SETTINGS.bodySize;
  letterSpacingSelect.value = DEFAULT_SETTINGS.letterSpacing;
  lineSpacingSelect.value = DEFAULT_SETTINGS.lineSpacing;
  dividerSpacingSelect.value = DEFAULT_SETTINGS.dividerSpacing;
  currencySymbol = DEFAULT_SETTINGS.currency;
  currencySelect.value = DEFAULT_SETTINGS.currency;
  recalcInvoice();
  syncMarks(DEFAULT_MARK, null);
};

// ============ PAGE MANAGER (reorder / hide) ============
const pageManager = document.getElementById('pageManager');
const pmList = document.getElementById('pmList');

document.getElementById('pagesToggle').onclick = () => {
  pageManager.classList.toggle('open');
  settingsPanel.classList.remove('open');
};

function buildPageManager() {
  pmList.innerHTML = '';
  pages.forEach((p) => {
    const item = document.createElement('div');
    item.className = 'pm-item' + (p.classList.contains('page-disabled') ? ' hidden-page' : '');
    item.draggable = true;
    item.dataset.page = p.dataset.page;
    item.innerHTML = `
      <span class="pm-drag">⠿</span>
      <span class="pm-name">${p.dataset.page.replace(/-/g, ' ')}</span>
      <button data-action="toggle">${p.classList.contains('page-disabled') ? 'Show' : 'Hide'}</button>
    `;
    item.querySelector('button').onclick = () => {
      p.classList.toggle('page-disabled');
      rebuildNav();
      buildPageManager();
    };
    item.addEventListener('dragstart', () => item.classList.add('dragging'));
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
    pmList.appendChild(item);
  });
}

pmList.addEventListener('dragover', (e) => {
  e.preventDefault();
  const dragging = pmList.querySelector('.dragging');
  if (!dragging) return;
  const siblings = [...pmList.querySelectorAll('.pm-item:not(.dragging)')];
  const next = siblings.find(sib => {
    const rect = sib.getBoundingClientRect();
    return e.clientY <= rect.top + rect.height / 2;
  });
  if (next) pmList.insertBefore(dragging, next);
  else pmList.appendChild(dragging);
});

pmList.addEventListener('drop', () => {
  const canvas = document.querySelector('.canvas-wrap');
  [...pmList.querySelectorAll('.pm-item')].forEach(item => {
    const page = pages.find(p => p.dataset.page === item.dataset.page);
    if (page) canvas.appendChild(page);
  });
  rebuildNav();
});

buildPageManager();

// ============ DOWNLOAD PDF ============
document.getElementById('downloadBtn').onclick = () => {
  window.print();
};

// ============ TOAST ============
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ============ EXPORT / IMPORT DATA ============
function gatherData() {
  const data = { _version: 2, settings: {}, pages: {}, currency: currencySymbol };
  // Gather settings
  data.settings = {
    font: fontSelect.value,
    headingFont: headingFontSelect.value,
    bodyWeight: bodyWeightSelect.value,
    headingWeight: headingWeightSelect.value,
    text: textColorPicker.value,
    titleColor: titleColorPicker.value,
    headingColor: headingColorPicker.value,
    accentColor: accentColorPicker.value,
    dividerColor: dividerColorPicker.value,
    bg: bgColorPicker.value,
    titleSize: titleSizeSelect.value,
    headingSize: headingSizeSelect.value,
    bodySize: bodySizeSelect.value,
    letterSpacing: letterSpacingSelect.value,
    lineSpacing: lineSpacingSelect.value,
    dividerSpacing: dividerSpacingSelect.value
  };
  // Gather mark logo HTML
  const firstMark = document.querySelector('.mark');
  data.markHTML = firstMark ? firstMark.innerHTML : '';
  // Page visibility & sequence
  data.pageOrder = pages.map(p => ({ id: p.dataset.page, disabled: p.classList.contains('page-disabled') }));
  // Editable fields per page
  data.pages = {};
  pages.forEach(p => {
    const key = p.dataset.page;
    const fields = [];
    p.querySelectorAll('[contenteditable="true"]').forEach(el => {
      if (el.closest('#scopeRows') || el.closest('#invoiceRows') || el.closest('#additionalRows') || el.closest('#welcomeRows') || el.closest('#guideRows') || el.closest('#paymentMethods')) return;
      if (el.classList.contains('mark')) return;
      fields.push(el.innerHTML);
    });
    data.pages[key] = { fields };
  });
  // Dynamic rows data
  data.welcomeRows = [];
  welcomeContainer.querySelectorAll('.row').forEach(row => {
    const title = row.querySelector('.h-section')?.innerHTML || '';
    const body = row.querySelector('.row-body [contenteditable]')?.innerHTML || '';
    data.welcomeRows.push({ title, body });
  });
  data.guideRows = [];
  guideContainer.querySelectorAll('.row').forEach(row => {
    const title = row.querySelector('.h-section')?.innerHTML || '';
    const body = row.querySelector('.row-body [contenteditable]')?.innerHTML || '';
    data.guideRows.push({ title, body });
  });
  data.scopeRows = [];
  scopeContainer.querySelectorAll('.row').forEach(row => {
    const title = row.querySelector('.h-section')?.innerHTML || '';
    const desc = row.querySelector('.row-body [contenteditable]')?.innerHTML || '';
    const price = row.querySelector('.label-mono')?.innerHTML || '';
    data.scopeRows.push({ title, desc, price });
  });
  data.additionalRows = [];
  additionalContainer.querySelectorAll('tr').forEach(tr => {
    const name = tr.querySelector('.svc-name')?.innerHTML || '';
    const price = tr.querySelector('.svc-price')?.innerHTML || '';
    const desc = tr.querySelector('.svc-desc')?.innerHTML || '';
    data.additionalRows.push({ name, price, desc });
  });
  data.invoiceRows = [];
  invoiceBody.querySelectorAll('tr').forEach(tr => {
    const title = tr.querySelector('.item-title')?.innerHTML || '';
    const desc = tr.querySelector('.item-desc')?.innerHTML || '';
    const qty = tr.querySelector('.f-qty')?.textContent || '1';
    const price = tr.querySelector('.f-price')?.textContent || '0.00';
    data.invoiceRows.push({ title, desc, qty, price });
  });
  // QR metadata & base64 content
  data.qrHidden = qrWrapper.classList.contains('qr-hidden');
  const qrImg = qrBox.querySelector('img');
  data.qrImage = qrImg ? qrImg.src : null;
  // Custom Payment methods
  data.paymentMethods = [];
  paymentMethodsContainer.querySelectorAll('.pay-method').forEach(pm => {
    const name = pm.querySelector('b')?.innerHTML || '';
    const details = pm.querySelector('.collapsible')?.innerHTML || '';
    data.paymentMethods.push({ name, details });
  });
  return data;
}

function restoreData(data) {
  if (!data || !data._version) { alert('Invalid file format.'); return; }
  // Settings sync
  const s = data.settings || {};
  if (s.font) { fontSelect.value = s.font; rootStyle.setProperty('--font-body', s.font); }
  if (s.headingFont) { headingFontSelect.value = s.headingFont; rootStyle.setProperty('--font-heading', s.headingFont); }
  if (s.bodyWeight) { bodyWeightSelect.value = s.bodyWeight; rootStyle.setProperty('--font-weight-body', s.bodyWeight); }
  if (s.headingWeight) { headingWeightSelect.value = s.headingWeight; rootStyle.setProperty('--font-weight-heading', s.headingWeight); }
  if (s.text) { textColorPicker.value = s.text; rootStyle.setProperty('--black', s.text); }
  if (s.titleColor) { titleColorPicker.value = s.titleColor; rootStyle.setProperty('--title-color', s.titleColor); }
  if (s.headingColor) { headingColorPicker.value = s.headingColor; rootStyle.setProperty('--heading-color', s.headingColor); }
  if (s.accentColor) { accentColorPicker.value = s.accentColor; rootStyle.setProperty('--accent-color', s.accentColor); }
  if (s.dividerColor) { dividerColorPicker.value = s.dividerColor; rootStyle.setProperty('--divider-color', s.dividerColor); }
  if (s.bg) { bgColorPicker.value = s.bg; rootStyle.setProperty('--paper', s.bg); }
  if (s.titleSize) { titleSizeSelect.value = s.titleSize; rootStyle.setProperty('--title-size-scale', s.titleSize); }
  if (s.headingSize) { headingSizeSelect.value = s.headingSize; rootStyle.setProperty('--heading-size-scale', s.headingSize); }
  if (s.bodySize) { bodySizeSelect.value = s.bodySize; rootStyle.setProperty('--body-size-scale', s.bodySize); }
  if (s.letterSpacing) { letterSpacingSelect.value = s.letterSpacing; rootStyle.setProperty('--letter-spacing-scale', s.letterSpacing); }
  if (s.lineSpacing) { lineSpacingSelect.value = s.lineSpacing; rootStyle.setProperty('--line-spacing-scale', s.lineSpacing); }
  if (s.dividerSpacing) { dividerSpacingSelect.value = s.dividerSpacing; rootStyle.setProperty('--divider-spacing-scale', s.dividerSpacing); }
  // Currency parsing
  if (data.currency) {
    currencySymbol = data.currency;
    let found = false;
    for (const opt of currencySelect.options) { if (opt.value === data.currency) { found = true; break; } }
    if (!found) {
      const opt = document.createElement('option');
      opt.value = data.currency;
      opt.textContent = data.currency + ' — Imported';
      currencySelect.insertBefore(opt, currencySelect.lastElementChild);
    }
    currencySelect.value = data.currency;
  }
  // Sync page marks
  if (data.markHTML !== undefined) syncMarks(data.markHTML, null);
  // Reorder & visibility restoration
  if (data.pageOrder) {
    const canvas = document.querySelector('.canvas-wrap');
    data.pageOrder.forEach(po => {
      const pg = pages.find(p => p.dataset.page === po.id);
      if (pg) {
        if (po.disabled) pg.classList.add('page-disabled'); else pg.classList.remove('page-disabled');
        canvas.appendChild(pg);
      }
    });
    rebuildNav();
    buildPageManager();
  }
  // Content blocks mapping
  if (data.pages) {
    pages.forEach(p => {
      const key = p.dataset.page;
      const pd = data.pages[key];
      if (!pd || !pd.fields) return;
      let idx = 0;
      p.querySelectorAll('[contenteditable="true"]').forEach(el => {
        if (el.closest('#scopeRows') || el.closest('#invoiceRows') || el.closest('#additionalRows') || el.closest('#welcomeRows') || el.closest('#guideRows') || el.closest('#paymentMethods')) return;
        if (el.classList.contains('mark')) return;
        if (idx < pd.fields.length) el.innerHTML = pd.fields[idx];
        idx++;
      });
    });
  }
  // Dynamic sections loading
  welcomeContainer.innerHTML = '';
  (data.welcomeRows || []).forEach(r => welcomeContainer.appendChild(makeWelcomeRow(r.title, r.body)));
  guideContainer.innerHTML = '';
  (data.guideRows || []).forEach(r => guideContainer.appendChild(makeGuideRow(r.title, r.body)));
  scopeContainer.innerHTML = '';
  (data.scopeRows || []).forEach(r => scopeContainer.appendChild(makeScopeRow(r.title, r.desc, r.price)));
  additionalContainer.innerHTML = '';
  (data.additionalRows || []).forEach(r => additionalContainer.appendChild(makeAdditionalRow(r.name, r.price, r.desc)));
  invoiceBody.innerHTML = '';
  (data.invoiceRows || []).forEach(r => invoiceBody.appendChild(makeInvoiceRow(r.title, r.desc, parseFloat(r.qty) || 1, r.price)));
  recalcInvoice();
  // Restore QR content & settings
  if (data.qrHidden) qrWrapper.classList.add('qr-hidden'); else qrWrapper.classList.remove('qr-hidden');
  if (data.qrImage) {
    const label = document.getElementById('qrBoxLabel');
    if (label) label.remove();
    let img = qrBox.querySelector('img');
    if (!img) { img = document.createElement('img'); qrBox.insertBefore(img, qrBox.querySelector('.qr-hint')); }
    img.src = data.qrImage;
  }
  // Payment methods list restoration
  if (data.paymentMethods) {
    paymentMethodsContainer.innerHTML = '';
    data.paymentMethods.forEach(pm => {
      paymentMethodsContainer.appendChild(makePaymentMethod(pm.name, pm.details));
    });
  }
  showToast('Proposal data imported successfully');
}

document.getElementById('exportBtn').onclick = () => {
  const data = gatherData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'proposal-data.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Proposal data exported');
};

document.getElementById('importBtn').onclick = () => {
  document.getElementById('importFile').click();
};

document.getElementById('importFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      restoreData(data);
    } catch (err) {
      alert('Failed to parse import file. Make sure it is a valid .json file exported from Proposal Studio.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// ============ CLEAR ALL ============
document.getElementById('clearAll').onclick = () => {
  if (!confirm('Clear all fields and rows? This cannot be undone.')) return;
  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    if (!el.closest('#scopeRows') && !el.closest('#invoiceRows') && !el.closest('#additionalRows') && !el.closest('#welcomeRows') && !el.closest('#guideRows') && !el.closest('#paymentMethods') && !el.classList.contains('mark')) {
      el.textContent = '';
    }
  });
  scopeContainer.innerHTML = '';
  invoiceBody.innerHTML = '';
  additionalContainer.innerHTML = '';
  welcomeContainer.innerHTML = '';
  guideContainer.innerHTML = '';
  paymentMethodsContainer.innerHTML = '';
  recalcInvoice();
};

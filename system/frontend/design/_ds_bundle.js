/* @ds-bundle: {"format":4,"namespace":"CaughtDesignSystem_eb3eb1","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Checkbox","sourcePath":"components/core/Checkbox.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Radio","sourcePath":"components/core/Radio.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"Badge","sourcePath":"components/data/Badge.jsx"},{"name":"ConfidenceMeter","sourcePath":"components/data/ConfidenceMeter.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"MetricStat","sourcePath":"components/data/MetricStat.jsx"},{"name":"StatusDot","sourcePath":"components/data/StatusDot.jsx"},{"name":"Tabs","sourcePath":"components/data/Tabs.jsx"},{"name":"Tag","sourcePath":"components/data/Tag.jsx"},{"name":"VerdictChip","sourcePath":"components/data/VerdictChip.jsx"},{"name":"InlineAlert","sourcePath":"components/feedback/InlineAlert.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Dialog","sourcePath":"components/surfaces/Dialog.jsx"},{"name":"Panel","sourcePath":"components/surfaces/Panel.jsx"},{"name":"Tooltip","sourcePath":"components/surfaces/Tooltip.jsx"}],"sourceHashes":{"components/core/Button.jsx":"44b482d93e9f","components/core/Checkbox.jsx":"cedcedec9e66","components/core/Icon.jsx":"d639a6147de7","components/core/IconButton.jsx":"ae8a0cdd342a","components/core/Input.jsx":"ee9ef9ac61d1","components/core/Radio.jsx":"d00be2401a89","components/core/Select.jsx":"62f50177f4c8","components/core/Switch.jsx":"472990b3a8ed","components/data/Badge.jsx":"03a4655e8c9d","components/data/ConfidenceMeter.jsx":"b97cb0b64d40","components/data/DataTable.jsx":"d6279389b6a4","components/data/MetricStat.jsx":"c4a4fb64d0af","components/data/StatusDot.jsx":"5d81dccae299","components/data/Tabs.jsx":"d62d510509c2","components/data/Tag.jsx":"78ec3559a015","components/data/VerdictChip.jsx":"8a1ee05da547","components/feedback/InlineAlert.jsx":"ec3283dd8377","components/feedback/Toast.jsx":"1aa9664d6cd1","components/surfaces/Card.jsx":"2ae4f52250cd","components/surfaces/Dialog.jsx":"d01315064045","components/surfaces/Panel.jsx":"3e979a94bbfc","components/surfaces/Tooltip.jsx":"89e57d7b8a1c","ui_kits/console/Alerts.jsx":"f33a1975cb42","ui_kits/console/AppShell.jsx":"39d25ba9c556","ui_kits/console/FlowDetail.jsx":"cf0eafed99f2","ui_kits/console/LiveFlows.jsx":"a8a9b1d18385","ui_kits/console/Models.jsx":"75931447d20d","ui_kits/console/Sources.jsx":"094c948455ce","ui_kits/console/data.js":"8df6a652b2ff"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CaughtDesignSystem_eb3eb1 = window.CaughtDesignSystem_eb3eb1 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide SVGs ship as files in assets/icons. The component fetches a glyph once,
   caches its inner markup, and renders it as a real <svg> so stroke inherits the
   surrounding colour. The base path is derived from the design-system bundle's own
   URL, so cards, kits and consuming pages resolve it at any depth. */
const ICON_BASE = (() => {
  const s = document.querySelector('script[src*="_ds_bundle.js"]');
  return s ? s.src.replace(/_ds_bundle\.js.*$/, 'assets/icons/') : 'assets/icons/';
})();
const CACHE = new Map();
function load(name) {
  if (CACHE.has(name)) return CACHE.get(name);
  const p = fetch(ICON_BASE + name + '.svg').then(r => r.ok ? r.text() : '').then(t => t.replace(/<\?xml[\s\S]*?\?>/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')).catch(() => '');
  CACHE.set(name, p);
  return p;
}
function Icon({
  name,
  size = 14,
  color = 'currentColor',
  strokeWidth = 2,
  title,
  style,
  ...rest
}) {
  const [markup, setMarkup] = React.useState('');
  React.useEffect(() => {
    let alive = true;
    load(name).then(m => {
      if (alive) setMarkup(m);
    });
    return () => {
      alive = false;
    };
  }, [name]);
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: title ? 'img' : 'presentation',
    "aria-label": title || undefined,
    style: {
      display: 'inline-block',
      flex: '0 0 auto',
      overflow: 'visible',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: markup
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const HEIGHT = {
  sm: 'var(--control-h-sm)',
  md: 'var(--control-h-md)',
  lg: 'var(--control-h-lg)'
};
const PAD = {
  sm: '0 var(--space-8)',
  md: '0 var(--space-12)',
  lg: '0 var(--space-16)'
};
const FS = {
  sm: 'var(--fs-11)',
  md: 'var(--fs-12)',
  lg: 'var(--fs-13)'
};
const TONES = {
  primary: {
    bg: 'var(--accent)',
    fg: 'var(--on-accent)',
    bd: 'var(--accent)',
    bgHover: 'var(--accent-hover)'
  },
  secondary: {
    bg: 'var(--surface-control)',
    fg: 'var(--text-body)',
    bd: 'var(--border-control)',
    bgHover: 'var(--surface-control-hover)'
  },
  ghost: {
    bg: 'transparent',
    fg: 'var(--text-secondary)',
    bd: 'transparent',
    bgHover: 'var(--surface-control)'
  },
  caution: {
    bg: 'var(--surface-control)',
    fg: 'var(--amber-400)',
    bd: 'var(--status-warn-border)',
    bgHover: 'var(--status-warn-bg)'
  }
};
function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconEnd,
  disabled,
  active,
  fullWidth,
  type = 'button',
  style,
  ...rest
}) {
  const t = TONES[variant] || TONES.secondary;
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const lit = (hover || active) && !disabled;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-6)',
      height: HEIGHT[size],
      padding: PAD[size],
      font: 'var(--type-ui)',
      fontSize: FS[size],
      color: disabled ? 'var(--text-disabled)' : t.fg,
      background: disabled ? 'var(--surface-control)' : lit ? t.bgHover : t.bg,
      border: `1px solid ${disabled ? 'var(--border-hairline)' : t.bd}`,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      whiteSpace: 'nowrap',
      transition: 'var(--transition-control)',
      transform: press && !disabled ? 'translateY(1px)' : 'none',
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'lg' ? 14 : 12
  }) : null, children, iconEnd ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconEnd,
    size: size === 'lg' ? 14 : 12
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  indeterminate,
  onChange,
  disabled,
  hint,
  style
}) {
  const on = checked || indeterminate;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: hint ? 'flex-start' : 'center',
      gap: 'var(--space-8)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 14,
      height: 14,
      marginTop: hint ? 2 : 0,
      flex: '0 0 auto',
      background: on ? 'var(--accent)' : 'var(--surface-inset)',
      border: `1px solid ${on ? 'var(--accent)' : 'var(--border-control)'}`,
      borderRadius: 'var(--radius-xs)',
      transition: 'var(--transition-control)'
    }
  }, indeterminate ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 1,
      background: 'var(--on-accent)'
    }
  }) : checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 10,
    color: "var(--on-accent)"
  }) : null), label ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontWeight: 400,
      color: 'var(--text-body)'
    }
  }, label), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 2,
      font: 'var(--type-ui)',
      fontWeight: 400,
      fontSize: 'var(--fs-11)',
      color: 'var(--text-faint)'
    }
  }, hint) : null) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BOX = {
  sm: 22,
  md: 28,
  lg: 34
};
function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  active,
  disabled,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const lit = (hover || active) && !disabled;
  const solid = variant === 'solid';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: BOX[size],
      height: BOX[size],
      padding: 0,
      color: disabled ? 'var(--text-disabled)' : solid ? 'var(--on-accent)' : active ? 'var(--accent)' : hover ? 'var(--text-primary)' : 'var(--text-muted)',
      background: solid ? lit ? 'var(--accent-hover)' : 'var(--accent)' : lit ? 'var(--surface-control)' : 'transparent',
      border: `1px solid ${variant === 'secondary' ? 'var(--border-control)' : solid ? 'var(--accent)' : 'transparent'}`,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'var(--transition-control)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 12 : size === 'lg' ? 16 : 14
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const H = {
  sm: 'var(--control-h-sm)',
  md: 'var(--control-h-md)',
  lg: 'var(--control-h-lg)'
};
function Input({
  label,
  hint,
  icon,
  mono,
  size = 'md',
  invalid,
  disabled,
  fullWidth,
  suffix,
  style,
  wrapperStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const border = invalid ? 'var(--status-warn-border)' : focus ? 'var(--border-focus)' : 'var(--border-control)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: fullWidth ? 'block' : 'inline-block',
      width: fullWidth ? '100%' : undefined,
      ...wrapperStyle
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-6)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)',
      height: H[size],
      padding: '0 var(--space-8)',
      background: disabled ? 'var(--surface-app)' : 'var(--surface-inset)',
      border: `1px solid ${border}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: focus ? 'var(--ring-focus)' : 'none',
      transition: 'var(--transition-control)'
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12,
    color: "var(--text-faint)"
  }) : null, /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      background: 'none',
      border: 'none',
      outline: 'none',
      padding: 0,
      font: mono ? 'var(--type-data)' : 'var(--type-ui)',
      fontWeight: 400,
      letterSpacing: mono ? 'var(--tracking-data)' : undefined,
      color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
      ...style
    }
  }, rest)), suffix ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-dense)',
      color: 'var(--text-faint)'
    }
  }, suffix) : null), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 'var(--space-4)',
      font: 'var(--type-ui)',
      fontWeight: 400,
      fontSize: 'var(--fs-11)',
      color: invalid ? 'var(--amber-400)' : 'var(--text-faint)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Radio.jsx
try { (() => {
function Radio({
  label,
  hint,
  checked,
  onChange,
  disabled,
  name,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: hint ? 'flex-start' : 'center',
      gap: 'var(--space-8)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    checked: !!checked,
    disabled: disabled,
    onChange: () => onChange && onChange(true),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 14,
      height: 14,
      marginTop: hint ? 2 : 0,
      flex: '0 0 auto',
      background: 'var(--surface-inset)',
      border: `1px solid ${checked ? 'var(--accent)' : 'var(--border-control)'}`,
      borderRadius: 'var(--radius-pill)',
      transition: 'var(--transition-control)'
    }
  }, checked ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--accent)'
    }
  }) : null), label ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontWeight: 400,
      color: 'var(--text-body)'
    }
  }, label), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 2,
      font: 'var(--type-ui)',
      fontWeight: 400,
      fontSize: 'var(--fs-11)',
      color: 'var(--text-faint)'
    }
  }, hint) : null) : null);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Radio.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
const H = {
  sm: 'var(--control-h-sm)',
  md: 'var(--control-h-md)',
  lg: 'var(--control-h-lg)'
};
function Select({
  label,
  options = [],
  value,
  onChange,
  size = 'md',
  mono,
  disabled,
  fullWidth,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: fullWidth ? 'block' : 'inline-block',
      width: fullWidth ? '100%' : undefined
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-6)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: H[size],
      background: 'var(--surface-control)',
      border: `1px solid ${focus ? 'var(--border-focus)' : 'var(--border-control)'}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: focus ? 'var(--ring-focus)' : 'none',
      transition: 'var(--transition-control)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: '100%',
      padding: '0 26px 0 var(--space-8)',
      background: 'none',
      border: 'none',
      outline: 'none',
      font: mono ? 'var(--type-data-strong)' : 'var(--type-ui)',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-body)',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value,
      style: {
        background: 'var(--surface-panel)'
      }
    }, opt.label);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 12,
    color: "var(--text-faint)",
    style: {
      position: 'absolute',
      right: 'var(--space-8)',
      pointerEvents: 'none'
    }
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  onChange,
  disabled,
  size = 'md',
  style
}) {
  const w = size === 'sm' ? 24 : 30;
  const h = size === 'sm' ? 14 : 16;
  const knob = h - 4;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      position: 'relative',
      display: 'inline-block',
      width: w,
      height: h,
      flex: '0 0 auto',
      background: checked ? 'var(--accent)' : 'var(--ink-700)',
      border: `1px solid ${checked ? 'var(--accent)' : 'var(--border-control)'}`,
      borderRadius: 'var(--radius-pill)',
      transition: 'background-color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 1,
      left: checked ? w - knob - 3 : 1,
      width: knob,
      height: knob,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--on-accent)' : 'var(--steel-400)',
      transition: `left var(--dur-fast) var(--ease-out)`
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontWeight: 400,
      color: 'var(--text-body)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/data/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    fg: 'var(--text-secondary)',
    bg: 'rgba(166,180,198,.07)',
    bd: 'var(--border-subtle)'
  },
  accent: {
    fg: 'var(--cyan-300)',
    bg: 'var(--accent-quiet)',
    bd: 'rgba(79,175,188,.38)'
  },
  warn: {
    fg: 'var(--amber-400)',
    bg: 'var(--status-warn-bg)',
    bd: 'var(--status-warn-border)'
  },
  quiet: {
    fg: 'var(--text-faint)',
    bg: 'transparent',
    bd: 'var(--border-hairline)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  icon,
  mono,
  count,
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 16,
      padding: '0 5px',
      background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: 'var(--radius-xs)',
      color: t.fg,
      font: mono ? 'var(--type-data-dense)' : 'var(--font-sans)',
      fontSize: mono ? 'var(--fs-10)' : 'var(--fs-10)',
      fontWeight: mono ? 500 : 600,
      letterSpacing: mono ? 'var(--tracking-data)' : 'var(--tracking-label)',
      textTransform: mono ? 'none' : 'uppercase',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 10
  }) : null, children, count != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      opacity: 0.8
    }
  }, count) : null);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data/ConfidenceMeter.jsx
try { (() => {
const SEGMENTS = 10;
function ConfidenceMeter({
  value = 0,
  verdict = 'benign',
  threshold,
  segments = SEGMENTS,
  showValue = true,
  width = 96,
  size = 'md',
  label,
  style
}) {
  const pct = Math.max(0, Math.min(1, value));
  const filled = Math.round(pct * segments);
  const low = threshold != null && pct < threshold;
  const fill = low ? 'var(--amber-400)' : verdict === 'malicious' ? 'var(--verdict-malicious-solid)' : verdict === 'unknown' ? 'var(--ink-600)' : 'var(--steel-300)';
  const h = size === 'sm' ? 4 : size === 'lg' ? 10 : 6;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 2,
      width,
      height: h
    },
    role: "meter",
    "aria-valuenow": pct
  }, Array.from({
    length: segments
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      background: i < filled ? fill : 'var(--ink-750)',
      borderRadius: 1,
      transition: 'background-color var(--dur-fast) var(--ease-out)'
    }
  }))), showValue ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-strong)',
      fontSize: size === 'sm' ? 'var(--fs-11)' : 'var(--fs-12)',
      color: low ? 'var(--amber-400)' : 'var(--text-secondary)',
      letterSpacing: 'var(--tracking-data)'
    }
  }, pct.toFixed(2)) : null);
}
Object.assign(__ds_scope, { ConfidenceMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ConfidenceMeter.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
/* The centrepiece surface. Legibility at 11–12px and 30+ visible rows beats every
   other consideration: hairline row rules, no zebra striping, mono values, and a
   2px left edge that carries selection or a malicious verdict. */
function DataTable({
  columns = [],
  rows = [],
  rowKey = 'id',
  dense,
  selectedKey,
  onRowClick,
  rowTone,
  stickyHeader = true,
  sortKey,
  sortDir = 'desc',
  onSort,
  emptyLabel = 'No flows match the current filter',
  animateNew,
  style
}) {
  const rowH = dense ? 'var(--row-h-dense)' : 'var(--row-h)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      overflow: 'auto',
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    onClick: () => c.sortable && onSort && onSort(c.key),
    style: {
      position: stickyHeader ? 'sticky' : 'static',
      top: 0,
      zIndex: 2,
      width: c.width,
      textAlign: c.align || 'left',
      padding: `0 var(--space-8)`,
      height: 26,
      background: 'var(--surface-raised)',
      borderBottom: '1px solid var(--border-subtle)',
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      cursor: c.sortable ? 'pointer' : 'default',
      whiteSpace: 'nowrap',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start'
    }
  }, c.label, c.sortable && sortKey === c.key ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: sortDir === 'asc' ? 'chevron-down' : 'chevron-down',
    size: 10,
    color: "var(--accent)",
    style: {
      transform: sortDir === 'asc' ? 'rotate(180deg)' : 'none'
    }
  }) : null))))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length,
    style: {
      padding: 'var(--space-32) var(--space-12)',
      textAlign: 'center',
      font: 'var(--type-ui)',
      fontWeight: 400,
      color: 'var(--text-faint)'
    }
  }, emptyLabel)) : rows.map((r, i) => {
    const key = r[rowKey] != null ? r[rowKey] : i;
    const tone = rowTone ? rowTone(r) : undefined;
    const selected = selectedKey != null && key === selectedKey;
    const edge = selected ? 'var(--accent)' : tone === 'alert' ? 'var(--verdict-malicious-solid)' : tone === 'warn' ? 'var(--amber-400)' : 'transparent';
    return /*#__PURE__*/React.createElement("tr", {
      key: key,
      onClick: () => onRowClick && onRowClick(r),
      style: {
        height: rowH,
        background: selected ? 'var(--surface-row-selected)' : tone === 'alert' ? 'var(--verdict-malicious-bg)' : 'transparent',
        boxShadow: `inset 2px 0 0 ${edge}`,
        cursor: onRowClick ? 'pointer' : 'default',
        animation: animateNew && r.isNew ? 'caught-row-in var(--dur-slow) var(--ease-out)' : 'none'
      },
      onMouseEnter: e => {
        if (!selected) e.currentTarget.style.background = tone === 'alert' ? 'rgba(228,87,46,.19)' : 'var(--surface-row-hover)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = selected ? 'var(--surface-row-selected)' : tone === 'alert' ? 'var(--verdict-malicious-bg)' : 'transparent';
      }
    }, columns.map(c => /*#__PURE__*/React.createElement("td", {
      key: c.key,
      style: {
        padding: '0 var(--space-8)',
        textAlign: c.align || 'left',
        borderBottom: '1px solid var(--border-hairline)',
        font: c.mono === false ? 'var(--type-ui)' : dense ? 'var(--type-data-dense)' : 'var(--type-data)',
        fontWeight: c.emphasis ? 500 : 400,
        letterSpacing: c.mono === false ? undefined : 'var(--tracking-data)',
        color: c.muted ? 'var(--text-muted)' : c.emphasis ? 'var(--text-primary)' : 'var(--text-body)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, c.render ? c.render(r) : r[c.key])));
  }))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricStat.jsx
try { (() => {
function MetricStat({
  label,
  value,
  unit,
  delta,
  deltaTone = 'neutral',
  hint,
  size = 'md',
  align = 'left',
  style
}) {
  const font = size === 'lg' ? 'var(--type-metric-lg)' : size === 'sm' ? 'var(--type-data-strong)' : 'var(--type-metric)';
  const dcolor = deltaTone === 'warn' ? 'var(--amber-400)' : deltaTone === 'accent' ? 'var(--cyan-400)' : 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      alignItems: align === 'right' ? 'flex-end' : 'flex-start',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font,
      color: 'var(--text-primary)',
      letterSpacing: 'var(--tracking-data)'
    }
  }, value), unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-dense)',
      color: 'var(--text-faint)'
    }
  }, unit) : null, delta ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      font: 'var(--type-data-dense)',
      color: dcolor,
      paddingLeft: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "trending-up",
    size: 10
  }), delta) : null), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontWeight: 400,
      fontSize: 'var(--fs-11)',
      color: 'var(--text-faint)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { MetricStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricStat.jsx", error: String((e && e.message) || e) }); }

// components/data/StatusDot.jsx
try { (() => {
const TONES = {
  live: 'var(--status-live)',
  warn: 'var(--status-warn)',
  idle: 'var(--status-idle)',
  offline: 'var(--status-offline)',
  alert: 'var(--verdict-malicious-solid)'
};
function StatusDot({
  tone = 'idle',
  pulse,
  label,
  size = 6,
  mono,
  style
}) {
  const color = TONES[tone] || TONES.idle;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-6)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-pill)',
      background: color,
      boxShadow: tone === 'live' ? `0 0 6px ${color}` : 'none',
      animation: pulse ? 'caught-live-pulse var(--dur-pulse) var(--ease-in-out) infinite' : 'none'
    }
  }), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: mono ? 'var(--type-data-dense)' : 'var(--type-ui)',
      fontWeight: mono ? 400 : 500,
      color: 'var(--text-secondary)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/data/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  onChange,
  variant = 'underline',
  size = 'md',
  style
}) {
  const seg = variant === 'segmented';
  const h = size === 'sm' ? 'var(--control-h-sm)' : 'var(--control-h-md)';
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'inline-flex',
      alignItems: 'stretch',
      gap: seg ? 0 : 'var(--space-16)',
      height: h,
      background: seg ? 'var(--surface-inset)' : 'transparent',
      border: seg ? '1px solid var(--border-control)' : 'none',
      borderBottom: seg ? '1px solid var(--border-control)' : '1px solid var(--border-hairline)',
      borderRadius: seg ? 'var(--radius-sm)' : 0,
      padding: seg ? 2 : 0,
      ...style
    }
  }, tabs.map(t => {
    const tab = typeof t === 'string' ? {
      value: t,
      label: t
    } : t;
    const on = tab.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.value,
      role: "tab",
      "aria-selected": on,
      onClick: () => onChange && onChange(tab.value),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-6)',
        padding: seg ? '0 var(--space-10)' : '0 0 1px',
        background: seg && on ? 'var(--surface-control)' : 'transparent',
        border: 'none',
        borderBottom: seg ? 'none' : `2px solid ${on ? 'var(--accent)' : 'transparent'}`,
        borderRadius: seg ? 'var(--radius-xs)' : 0,
        font: 'var(--type-ui)',
        fontSize: size === 'sm' ? 'var(--fs-11)' : 'var(--fs-12)',
        color: on ? 'var(--text-primary)' : 'var(--text-muted)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'var(--transition-control)'
      }
    }, tab.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: tab.icon,
      size: 12
    }) : null, tab.label, tab.count != null ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-10)',
        color: on ? 'var(--accent)' : 'var(--text-faint)'
      }
    }, tab.count) : null);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/data/Tag.jsx
try { (() => {
function Tag({
  children,
  onRemove,
  active,
  mono = true,
  icon,
  title,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    title: title,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      height: 20,
      padding: onRemove ? '0 3px 0 var(--space-6)' : '0 var(--space-6)',
      background: active ? 'var(--accent-quiet)' : 'var(--surface-control)',
      border: `1px solid ${active ? 'rgba(79,175,188,.38)' : 'var(--border-control)'}`,
      borderRadius: 'var(--radius-sm)',
      color: active ? 'var(--cyan-300)' : 'var(--text-secondary)',
      font: mono ? 'var(--type-data-dense)' : 'var(--type-ui)',
      fontWeight: mono ? 400 : 500,
      letterSpacing: mono ? 'var(--tracking-data)' : undefined,
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 10
  }) : null, children, onRemove ? /*#__PURE__*/React.createElement("span", {
    onClick: onRemove,
    role: "button",
    "aria-label": "Remove",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 14,
      height: 14,
      cursor: 'pointer',
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 9
  })) : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/VerdictChip.jsx
try { (() => {
/* The one component the whole product turns on: it must be readable at 11px in a
   scrolling row and unmistakable at hero size. Benign is achromatic on purpose —
   only malicious spends the vermilion. */
const VERDICTS = {
  benign: {
    label: 'BENIGN',
    icon: 'shield-check',
    fg: 'var(--verdict-benign-fg)',
    bg: 'var(--verdict-benign-bg)',
    bd: 'var(--verdict-benign-border)',
    solidBg: 'var(--steel-300)'
  },
  malicious: {
    label: 'MALICIOUS',
    icon: 'shield-alert',
    fg: 'var(--verdict-malicious-fg)',
    bg: 'var(--verdict-malicious-bg)',
    bd: 'var(--verdict-malicious-border)',
    solidBg: 'var(--verdict-malicious-solid)'
  },
  unknown: {
    label: 'UNSCORED',
    icon: 'circle-dot',
    fg: 'var(--verdict-unknown-fg)',
    bg: 'var(--verdict-unknown-bg)',
    bd: 'var(--verdict-unknown-border)',
    solidBg: 'var(--ink-600)'
  }
};
const SIZES = {
  sm: {
    h: 16,
    pad: '0 5px',
    fs: 'var(--fs-10)',
    icon: 10,
    gap: 4
  },
  md: {
    h: 22,
    pad: '0 var(--space-8)',
    fs: 'var(--fs-11)',
    icon: 12,
    gap: 6
  },
  hero: {
    h: 34,
    pad: '0 var(--space-12)',
    fs: 'var(--fs-14)',
    icon: 16,
    gap: 8
  }
};
function VerdictChip({
  verdict = 'benign',
  size = 'sm',
  confidence,
  solid,
  label,
  style
}) {
  const v = VERDICTS[verdict] || VERDICTS.unknown;
  const s = SIZES[size] || SIZES.sm;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: s.gap,
      height: s.h,
      padding: s.pad,
      background: solid ? v.solidBg : v.bg,
      border: `1px solid ${solid ? v.solidBg : v.bd}`,
      borderRadius: 'var(--radius-xs)',
      color: solid ? 'var(--ink-1000)' : v.fg,
      whiteSpace: 'nowrap',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: v.icon,
    size: s.icon
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-sans)',
      fontSize: s.fs,
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--tracking-label)',
      lineHeight: 1
    }
  }, label || v.label), confidence != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: s.fs,
      fontWeight: 'var(--fw-medium)',
      lineHeight: 1,
      opacity: solid ? 0.72 : 0.78,
      paddingLeft: 2
    }
  }, Number(confidence).toFixed(2)) : null);
}
Object.assign(__ds_scope, { VerdictChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/VerdictChip.jsx", error: String((e && e.message) || e) }); }

// components/feedback/InlineAlert.jsx
try { (() => {
const TONES = {
  info: {
    fg: 'var(--text-body)',
    icon: 'info',
    ic: 'var(--cyan-400)',
    bg: 'var(--accent-quiet)',
    bd: 'rgba(79,175,188,.32)'
  },
  warn: {
    fg: 'var(--text-body)',
    icon: 'triangle-alert',
    ic: 'var(--amber-400)',
    bg: 'var(--status-warn-bg)',
    bd: 'var(--status-warn-border)'
  },
  alert: {
    fg: 'var(--text-primary)',
    icon: 'shield-alert',
    ic: 'var(--verdict-malicious-fg)',
    bg: 'var(--verdict-malicious-bg)',
    bd: 'var(--verdict-malicious-border)'
  },
  quiet: {
    fg: 'var(--text-secondary)',
    icon: 'info',
    ic: 'var(--text-faint)',
    bg: 'transparent',
    bd: 'var(--border-subtle)'
  }
};
function InlineAlert({
  tone = 'info',
  title,
  children,
  action,
  icon,
  style
}) {
  const t = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-8)',
      padding: 'var(--space-10) var(--space-12)',
      background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: 'var(--radius-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || t.icon,
    size: 13,
    color: t.ic,
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-ui)',
      fontWeight: 600,
      color: t.fg,
      marginBottom: children ? 3 : 0
    }
  }, title) : null, children ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-ui)',
      fontWeight: 400,
      fontSize: 'var(--fs-11)',
      color: 'var(--text-secondary)',
      lineHeight: 'var(--lh-snug)',
      textWrap: 'pretty'
    }
  }, children) : null), action ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      marginLeft: 'var(--space-4)'
    }
  }, action) : null);
}
Object.assign(__ds_scope, { InlineAlert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/InlineAlert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TONES = {
  neutral: {
    ic: 'var(--text-muted)',
    icon: 'info',
    bd: 'var(--border-strong)'
  },
  live: {
    ic: 'var(--cyan-400)',
    icon: 'circle-check',
    bd: 'rgba(79,175,188,.38)'
  },
  warn: {
    ic: 'var(--amber-400)',
    icon: 'triangle-alert',
    bd: 'var(--status-warn-border)'
  },
  alert: {
    ic: 'var(--verdict-malicious-fg)',
    icon: 'shield-alert',
    bd: 'var(--verdict-malicious-border)'
  }
};
function Toast({
  tone = 'neutral',
  title,
  message,
  meta,
  action,
  onDismiss,
  icon,
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-8)',
      width: 320,
      padding: 'var(--space-10) var(--space-10) var(--space-10) var(--space-12)',
      background: 'var(--surface-overlay)',
      border: `1px solid ${t.bd}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-overlay)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || t.icon,
    size: 13,
    color: t.ic,
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, title), meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      font: 'var(--type-data-dense)',
      fontSize: 'var(--fs-10)',
      color: 'var(--text-faint)'
    }
  }, meta) : null), message ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 3,
      font: 'var(--type-ui)',
      fontWeight: 400,
      fontSize: 'var(--fs-11)',
      color: 'var(--text-secondary)',
      lineHeight: 'var(--lh-snug)'
    }
  }, message) : null, action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)'
    }
  }, action) : null), onDismiss ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Dismiss",
    size: "sm",
    onClick: onDismiss
  }) : null);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function Card({
  title,
  meta,
  children,
  footer,
  interactive,
  selected,
  onClick,
  padding = 'var(--space-16)',
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: selected ? 'var(--surface-row-selected)' : 'var(--surface-raised)',
      border: `1px solid ${selected ? 'var(--accent)' : interactive && hover ? 'var(--border-strong)' : 'var(--border-hairline)'}`,
      borderRadius: 'var(--radius-md)',
      padding,
      cursor: interactive ? 'pointer' : 'default',
      transition: 'var(--transition-control)',
      ...style
    }
  }, title || meta ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-8)',
      marginBottom: 'var(--space-10)'
    }
  }, title ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-panel-title)',
      color: 'var(--text-primary)'
    }
  }, title) : null, meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      font: 'var(--type-data-dense)',
      color: 'var(--text-faint)'
    }
  }, meta) : null) : null, children, footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-12)',
      paddingTop: 'var(--space-10)',
      borderTop: '1px solid var(--border-hairline)',
      font: 'var(--type-data-dense)',
      color: 'var(--text-faint)'
    }
  }, footer) : null);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  icon,
  description,
  children,
  footer,
  width = 420,
  onClose,
  tone = 'default'
}) {
  if (!open) return null;
  const alert = tone === 'alert';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-24)',
      background: 'var(--scrim)',
      backdropFilter: 'var(--blur-scrim)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-label": title,
    style: {
      width,
      maxWidth: '100%',
      background: 'var(--surface-overlay)',
      border: `1px solid ${alert ? 'var(--verdict-malicious-border)' : 'var(--border-strong)'}`,
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-overlay)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      minHeight: 38,
      padding: '0 var(--space-8) 0 var(--space-16)',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'var(--surface-raised)'
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14,
    color: alert ? 'var(--verdict-malicious-fg)' : 'var(--text-muted)'
  }) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-panel-title)',
      fontSize: 'var(--fs-14)',
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, onClose ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    size: "sm",
    onClick: onClose
  }) : null)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-16)'
    }
  }, description ? /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)',
      marginBottom: children ? 'var(--space-16)' : 0,
      textWrap: 'pretty'
    }
  }, description) : null, children), footer ? /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 'var(--space-8)',
      padding: 'var(--space-12) var(--space-16)',
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--surface-raised)'
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Panel.jsx
try { (() => {
function Panel({
  title,
  eyebrow,
  meta,
  icon,
  actions,
  children,
  footer,
  flush,
  scroll,
  tone = 'default',
  style,
  bodyStyle
}) {
  const alert = tone === 'alert';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      background: 'var(--surface-panel)',
      border: `1px solid ${alert ? 'var(--verdict-malicious-border)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: alert ? 'var(--glow-alert)' : 'var(--shadow-panel)',
      overflow: 'hidden',
      ...style
    }
  }, title || actions || eyebrow ? /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      flex: '0 0 auto',
      minHeight: 34,
      padding: '0 var(--space-10) 0 var(--space-12)',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'var(--surface-raised)'
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 13,
    color: alert ? 'var(--verdict-malicious-fg)' : 'var(--text-muted)'
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-8)',
      minWidth: 0
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-panel-title)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title) : null, meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-dense)',
      color: 'var(--text-faint)',
      letterSpacing: 'var(--tracking-data)'
    }
  }, meta) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, actions)) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 auto',
      minHeight: 0,
      padding: flush ? 0 : 'var(--space-12)',
      overflow: scroll ? 'auto' : 'visible',
      ...bodyStyle
    }
  }, children), footer ? /*#__PURE__*/React.createElement("footer", {
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      minHeight: 32,
      padding: '0 var(--space-12)',
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--surface-raised)',
      font: 'var(--type-data-dense)',
      color: 'var(--text-faint)'
    }
  }, footer) : null);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Panel.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Tooltip.jsx
try { (() => {
const SIDE = {
  top: {
    bottom: '100%',
    left: '50%',
    transform: 'translate(-50%,-6px)'
  },
  bottom: {
    top: '100%',
    left: '50%',
    transform: 'translate(-50%,6px)'
  },
  left: {
    right: '100%',
    top: '50%',
    transform: 'translate(-6px,-50%)'
  },
  right: {
    left: '100%',
    top: '50%',
    transform: 'translate(6px,-50%)'
  }
};
function Tooltip({
  content,
  side = 'top',
  mono,
  children,
  style
}) {
  const [show, setShow] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, children, show ? /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      zIndex: 60,
      ...SIDE[side],
      padding: '4px var(--space-8)',
      maxWidth: 240,
      width: 'max-content',
      background: 'var(--surface-tooltip)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-xs)',
      boxShadow: 'var(--shadow-popover)',
      font: mono ? 'var(--type-data-dense)' : 'var(--type-ui)',
      fontWeight: 400,
      fontSize: 'var(--fs-11)',
      color: 'var(--text-body)',
      pointerEvents: 'none',
      whiteSpace: mono ? 'pre' : 'normal'
    }
  }, content) : null);
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Tooltip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Alerts.jsx
try { (() => {
const {
  Panel,
  DataTable,
  VerdictChip,
  ConfidenceMeter,
  Badge,
  Button,
  IconButton,
  InlineAlert,
  MetricStat,
  Tabs,
  Tag,
  Icon
} = window.CaughtDesignSystem_eb3eb1;
const STATE = {
  open: ['warn', 'open'],
  ack: ['accent', 'acknowledged'],
  closed: ['quiet', 'closed']
};
function Alerts({
  model,
  onInspect
}) {
  const alerts = window.CaughtData.alerts;
  const [sel, setSel] = React.useState(alerts[0].id);
  const [tab, setTab] = React.useState('open');
  const current = alerts.find(a => a.id === sel);
  const rows = alerts.filter(a => tab === 'all' ? true : tab === 'open' ? a.state === 'open' : a.state !== 'open');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gridTemplateRows: 'auto 1fr',
      gap: 'var(--space-12)',
      padding: 'var(--space-12)',
      height: '100%',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement(InlineAlert, {
    tone: "alert",
    title: "42 malicious flows from 10.4.19.22 in the last 31 seconds",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      icon: "eye",
      onClick: () => onInspect && onInspect()
    }, "Open in stream")
  }, "Sequential destination ports on 10.4.2.9, escalating packet rate, no completed handshakes. Peak confidence 0.97 from ", model, ".")), /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "CLUSTERS",
    title: "Alerts",
    meta: rows.length + ' shown',
    icon: "shield-alert",
    flush: true,
    scroll: true,
    style: {
      minHeight: 0
    },
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tabs, {
      variant: "segmented",
      size: "sm",
      value: tab,
      onChange: setTab,
      tabs: [{
        value: 'open',
        label: 'Open'
      }, {
        value: 'handled',
        label: 'Handled'
      }, {
        value: 'all',
        label: 'All'
      }]
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "download",
      label: "Export alerts",
      size: "sm"
    })),
    footer: /*#__PURE__*/React.createElement("span", null, "Clustered by source host and pattern \xB7 5 minute window")
  }, /*#__PURE__*/React.createElement(DataTable, {
    rowKey: "id",
    rows: rows,
    selectedKey: sel,
    onRowClick: r => setSel(r.id),
    rowTone: r => r.state === 'open' ? 'alert' : undefined,
    columns: [{
      key: 'first',
      label: 'First seen',
      width: '90px',
      muted: true
    }, {
      key: 'host',
      label: 'Source host',
      width: '124px',
      emphasis: true
    }, {
      key: 'target',
      label: 'Target',
      width: '110px'
    }, {
      key: 'pattern',
      label: 'Pattern',
      width: '146px',
      mono: false
    }, {
      key: 'flows',
      label: 'Flows',
      width: '64px',
      align: 'right'
    }, {
      key: 'window',
      label: 'Window',
      width: '74px',
      align: 'right',
      muted: true
    }, {
      key: 'peak',
      label: 'Peak',
      width: '128px',
      render: r => /*#__PURE__*/React.createElement(ConfidenceMeter, {
        value: r.peak,
        verdict: "malicious",
        width: 60,
        size: "sm"
      })
    }, {
      key: 'state',
      label: 'State',
      width: '108px',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: STATE[r.state][0]
      }, STATE[r.state][1])
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)',
      minHeight: 0,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    tone: current.state === 'open' ? 'alert' : 'default',
    eyebrow: "SELECTED",
    title: current.pattern,
    icon: "target"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(VerdictChip, {
    verdict: "malicious",
    size: "hero",
    solid: true,
    confidence: current.peak
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: '4px var(--space-10)',
      font: 'var(--type-data-dense)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "source"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-primary)'
    }
  }, current.host), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "target"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, current.target), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "flows"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, current.flows), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "window"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, current.window), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "first seen"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, current.first)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Tag, null, ":445 \xD718"), /*#__PURE__*/React.createElement(Tag, null, ":139 \xD79"), /*#__PURE__*/React.createElement(Tag, null, ":3389 \xD77"), /*#__PURE__*/React.createElement(Tag, null, ":22 \xD75")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "flag",
    fullWidth: true
  }, "Acknowledge"), /*#__PURE__*/React.createElement(Button, {
    variant: "caution",
    icon: "ban",
    fullWidth: true
  }, "Block host")))), /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "LAST HOUR",
    title: "Alert volume",
    icon: "trending-up"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-16)',
      marginBottom: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    label: "Clusters",
    value: "7",
    size: "sm"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Flows",
    value: "377",
    size: "sm"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Hosts",
    value: "3",
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 3,
      height: 46
    }
  }, [3, 5, 2, 8, 14, 9, 22, 31, 18, 42, 27, 12].map((v, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: v / 42 * 100 + '%',
      background: i > 8 ? 'var(--verdict-malicious-solid)' : 'var(--ink-650)',
      borderRadius: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 'var(--space-6)',
      font: 'var(--type-data-dense)',
      fontSize: 'var(--fs-10)',
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "13:22"), /*#__PURE__*/React.createElement("span", null, "14:22")))));
}
Object.assign(window, {
  Alerts
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Alerts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/AppShell.jsx
try { (() => {
const {
  Icon,
  IconButton,
  Badge,
  StatusDot,
  Select,
  Button
} = window.CaughtDesignSystem_eb3eb1;
const NAV = [{
  id: 'live',
  label: 'Live flows',
  icon: 'activity'
}, {
  id: 'alerts',
  label: 'Alerts',
  icon: 'shield-alert',
  count: 3
}, {
  id: 'models',
  label: 'Models',
  icon: 'cpu'
}, {
  id: 'sources',
  label: 'Sources',
  icon: 'route'
}];
function Wordmark() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 3,
      font: 'var(--font-sans)',
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: '-.03em',
      color: 'var(--steel-100)'
    }
  }, "Caught", /*#__PURE__*/React.createElement("i", {
    style: {
      width: 4,
      height: 4,
      background: 'var(--cyan-500)',
      display: 'inline-block'
    }
  }));
}
function NavItem({
  item,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      width: '100%',
      height: 28,
      padding: '0 var(--space-8)',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      background: active ? 'var(--surface-row-selected)' : hover ? 'var(--surface-control)' : 'transparent',
      boxShadow: active ? 'inset 2px 0 0 var(--accent)' : 'none',
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      font: 'var(--type-ui)',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'var(--transition-control)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: item.icon,
    size: 13,
    color: active ? 'var(--accent)' : 'var(--text-muted)'
  }), item.label, item.count ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "warn",
    mono: true
  }, item.count)) : null);
}
function AppShell({
  screen,
  onScreen,
  model,
  models,
  onSwitchModel,
  title,
  eyebrow,
  actions,
  children,
  statusRight,
  paused
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'var(--sidebar-w) 1fr',
      gridTemplateRows: '1fr',
      height: '100%',
      background: 'var(--canvas)',
      color: 'var(--text-body)',
      font: 'var(--type-body)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-16)',
      padding: 'var(--space-12) var(--space-10)',
      borderRight: '1px solid var(--border-subtle)',
      background: 'var(--surface-app)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      padding: '2px var(--space-4) 0'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, null), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "quiet",
    mono: true
  }, "v1.4"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement(NavItem, {
    key: n.id,
    item: n,
    active: screen === n.id,
    onClick: () => onScreen(n.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)',
      padding: 'var(--space-8) var(--space-4) 0',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    tone: paused ? 'idle' : 'live',
    pulse: !paused,
    mono: true,
    label: paused ? 'capture paused' : 'eth0 · 1.24 Gbps'
  }), /*#__PURE__*/React.createElement(StatusDot, {
    tone: "live",
    mono: true,
    label: model + ' loaded',
    size: 5
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-dense)',
      fontSize: 'var(--fs-10)',
      color: 'var(--text-faint)'
    }
  }, "soc-ops \xB7 shift 2"))), /*#__PURE__*/React.createElement("main", {
    style: {
      display: 'grid',
      gridTemplateRows: 'var(--topbar-h) 1fr var(--statusbar-h)',
      minWidth: 0,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-12)',
      padding: '0 var(--space-12)',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-app)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-8)'
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-panel-title)',
      fontSize: 'var(--fs-14)',
      color: 'var(--text-primary)'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)'
    }
  }, actions, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 18,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, "Model"), /*#__PURE__*/React.createElement(Select, {
    mono: true,
    size: "sm",
    value: model,
    onChange: onSwitchModel,
    options: models.map(m => ({
      value: m.id,
      label: m.id
    }))
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell",
    label: "Alerts"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "settings",
    label: "Settings"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 0,
      minWidth: 0,
      position: 'relative',
      background: 'var(--canvas)'
    }
  }, children), /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-16)',
      padding: '0 var(--space-12)',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-app)',
      font: 'var(--type-data-dense)',
      fontSize: 'var(--fs-10)',
      color: 'var(--text-faint)',
      letterSpacing: 'var(--tracking-data)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "eth0 \xB7 1.24 Gbps \xB7 drop 0.02%"), /*#__PURE__*/React.createElement("span", null, "model ", model, " \xB7 1.2 ms/flow"), /*#__PURE__*/React.createElement("span", null, "threshold 0.80"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, statusRight))));
}
Object.assign(window, {
  AppShell,
  Wordmark,
  CONSOLE_NAV: NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/FlowDetail.jsx
try { (() => {
const {
  VerdictChip,
  ConfidenceMeter,
  Panel,
  Button,
  IconButton,
  Badge,
  Tooltip,
  Icon,
  InlineAlert,
  Tag
} = window.CaughtDesignSystem_eb3eb1;
function KV({
  k,
  v,
  mono = true
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-dense)',
      color: 'var(--text-faint)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      font: mono ? 'var(--type-data)' : 'var(--type-ui)',
      color: 'var(--text-body)',
      letterSpacing: mono ? 'var(--tracking-data)' : undefined
    }
  }, v));
}
function FeatureBar({
  f,
  tone
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    mono: true,
    side: "right",
    content: f.key
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 118,
      font: 'var(--type-ui)',
      fontWeight: 400,
      fontSize: 'var(--fs-11)',
      color: 'var(--text-secondary)',
      borderBottom: '1px dotted var(--border-strong)'
    }
  }, f.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 54,
      font: 'var(--type-data-dense)',
      color: 'var(--text-body)',
      textAlign: 'right'
    }
  }, f.value), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 5,
      background: 'var(--ink-750)',
      borderRadius: 1,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: f.weight * 260 + '%',
      maxWidth: '100%',
      height: '100%',
      background: tone === 'alert' ? 'var(--verdict-malicious-solid)' : 'var(--steel-400)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      font: 'var(--type-data-dense)',
      fontSize: 'var(--fs-10)',
      color: 'var(--text-faint)',
      textAlign: 'right'
    }
  }, f.weight.toFixed(2)));
}
function FlowDetail({
  flow,
  model,
  onClose
}) {
  if (!flow) return null;
  const alert = flow.verdict === 'malicious';
  const agreement = window.CaughtData.agreement;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: 'var(--detail-w)',
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      background: 'var(--surface-panel)',
      borderLeft: '1px solid var(--border-strong)',
      boxShadow: 'var(--shadow-overlay)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      flex: '0 0 auto',
      minHeight: 38,
      padding: '0 var(--space-8) 0 var(--space-16)',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'var(--surface-raised)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "scan-line",
    size: 14,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-panel-title)',
      color: 'var(--text-primary)'
    }
  }, "Flow"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-dense)',
      color: 'var(--text-faint)'
    }
  }, flow.id, " \xB7 ", flow.ts), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "copy",
    label: "Copy flow id",
    size: "sm"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "external-link",
    label: "Open in new tab",
    size: "sm"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "x",
    label: "Close",
    size: "sm",
    onClick: onClose
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 auto',
      minHeight: 0,
      overflow: 'auto',
      padding: 'var(--space-16)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)',
      padding: 'var(--space-12)',
      borderRadius: 'var(--radius-md)',
      background: alert ? 'var(--verdict-malicious-bg)' : 'var(--surface-raised)',
      border: '1px solid ' + (alert ? 'var(--verdict-malicious-border)' : 'var(--border-hairline)')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(VerdictChip, {
    verdict: flow.verdict,
    size: "hero",
    solid: alert,
    confidence: flow.confidence
  }), flow.attack ? /*#__PURE__*/React.createElement(Badge, {
    tone: "warn",
    icon: "target"
  }, flow.attack) : null), /*#__PURE__*/React.createElement(ConfidenceMeter, {
    value: flow.confidence,
    verdict: flow.verdict,
    segments: 20,
    size: "lg",
    width: 340,
    threshold: 0.8,
    label: "conf"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontWeight: 400,
      fontSize: 'var(--fs-11)',
      color: 'var(--text-secondary)'
    }
  }, "Scored by ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)'
    }
  }, model), " in 1.2 ms, 14 features \xB7 threshold 0.80")), flow.confidence < 0.8 ? /*#__PURE__*/React.createElement(InlineAlert, {
    tone: "warn",
    title: "Confidence below your threshold"
  }, "Verify against the flow's neighbours before acting on this verdict alone.") : null, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-10)'
    }
  }, "Flow"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '92px 1fr',
      gap: '6px var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(KV, {
    k: "source",
    v: flow.src
  }), /*#__PURE__*/React.createElement(KV, {
    k: "destination",
    v: flow.dst
  }), /*#__PURE__*/React.createElement(KV, {
    k: "protocol",
    v: flow.proto + ' · ' + flow.service
  }), /*#__PURE__*/React.createElement(KV, {
    k: "packets",
    v: flow.pkts + ' fwd / ' + Math.max(0, Math.round(flow.pkts * 0.42)) + ' bwd'
  }), /*#__PURE__*/React.createElement(KV, {
    k: "bytes",
    v: flow.bytes.toLocaleString()
  }), /*#__PURE__*/React.createElement(KV, {
    k: "duration",
    v: flow.dur + ' ms'
  }), /*#__PURE__*/React.createElement(KV, {
    k: "flags",
    v: "SYN ACK RST"
  }))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-8)',
      marginBottom: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Feature contribution"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-dense)',
      fontSize: 'var(--fs-10)',
      color: 'var(--text-faint)'
    }
  }, "top 6 of 14")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, window.CaughtData.features.map(f => /*#__PURE__*/React.createElement(FeatureBar, {
    key: f.key,
    f: f,
    tone: alert ? 'alert' : undefined
  })))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-10)'
    }
  }, "Model agreement"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }
  }, agreement.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      height: 24,
      padding: '0 var(--space-8)',
      borderRadius: 'var(--radius-xs)',
      background: a.id === model ? 'var(--surface-row-selected)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 54,
      font: 'var(--type-data-dense)',
      color: a.id === model ? 'var(--text-primary)' : 'var(--text-muted)'
    }
  }, a.id), /*#__PURE__*/React.createElement(VerdictChip, {
    verdict: a.verdict
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(ConfidenceMeter, {
    value: a.confidence,
    verdict: a.verdict,
    threshold: 0.8,
    width: 72,
    size: "sm"
  })))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-10)'
    }
  }, "Neighbours from this host"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Tag, null, ":445 \xD718"), /*#__PURE__*/React.createElement(Tag, null, ":139 \xD79"), /*#__PURE__*/React.createElement(Tag, null, ":3389 \xD77"), /*#__PURE__*/React.createElement(Tag, null, ":22 \xD75"), /*#__PURE__*/React.createElement(Tag, null, ":80 \xD73")))), /*#__PURE__*/React.createElement("footer", {
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      padding: 'var(--space-12) var(--space-16)',
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--surface-raised)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "flag"
  }, "Acknowledge"), /*#__PURE__*/React.createElement(Button, {
    icon: "download"
  }, "Export PCAP"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "caution",
    icon: "ban"
  }, "Block source"))));
}
Object.assign(window, {
  FlowDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/FlowDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/LiveFlows.jsx
try { (() => {
const {
  Panel,
  DataTable,
  VerdictChip,
  ConfidenceMeter,
  MetricStat,
  Tabs,
  Tag,
  Input,
  Checkbox,
  Switch,
  IconButton,
  Button,
  Badge,
  InlineAlert,
  StatusDot,
  Tooltip,
  Icon
} = window.CaughtDesignSystem_eb3eb1;
const FLOW_COLUMNS = onOpen => [{
  key: 'ts',
  label: 'Time',
  width: '96px',
  muted: true,
  sortable: true
}, {
  key: 'src',
  label: 'Source',
  width: '162px',
  emphasis: true
}, {
  key: 'dst',
  label: 'Destination',
  width: '170px'
}, {
  key: 'proto',
  label: 'Proto',
  width: '52px',
  muted: true
}, {
  key: 'service',
  label: 'Service',
  width: '68px',
  muted: true
}, {
  key: 'pkts',
  label: 'Pkts',
  width: '54px',
  align: 'right'
}, {
  key: 'bytes',
  label: 'Bytes',
  width: '72px',
  align: 'right',
  render: r => r.bytes.toLocaleString()
}, {
  key: 'dur',
  label: 'Dur',
  width: '62px',
  align: 'right',
  render: r => r.dur + 'ms'
}, {
  key: 'verdict',
  label: 'Verdict',
  width: '142px',
  render: r => /*#__PURE__*/React.createElement(VerdictChip, {
    verdict: r.verdict,
    confidence: r.confidence
  })
}, {
  key: 'conf',
  label: 'Confidence',
  width: '112px',
  render: r => /*#__PURE__*/React.createElement(ConfidenceMeter, {
    value: r.confidence,
    verdict: r.verdict,
    threshold: 0.8,
    width: 56,
    size: "sm",
    showValue: false
  })
}, {
  key: 'go',
  label: '',
  width: '30px',
  align: 'right',
  render: r => /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 12,
    color: "var(--text-faint)"
  })
}];
function KpiStrip({
  flows
}) {
  const mal = flows.filter(f => f.verdict === 'malicious').length;
  const low = flows.filter(f => f.confidence < 0.8).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-32)',
      padding: 'var(--space-10) var(--space-16)',
      background: 'var(--surface-panel)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    label: "Flows scored",
    value: (12439 + flows.length).toLocaleString(),
    hint: "Since 13:52"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Malicious",
    value: String(mal + 31),
    hint: "Last 15 minutes"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Below threshold",
    value: String(low),
    hint: "Confidence < 0.80"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Flows / sec",
    value: "1,284",
    delta: "+8%",
    deltaTone: "accent"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    tone: "live",
    pulse: true,
    mono: true,
    label: "capture live \xB7 00:31:12"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-dense)',
      fontSize: 'var(--fs-10)',
      color: 'var(--text-faint)'
    }
  }, "queue 0 \xB7 drop 0.02%")));
}
function VerdictRail({
  latestMalicious,
  model,
  onInspect
}) {
  const agreement = window.CaughtData.agreement;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    tone: "alert",
    eyebrow: "CURRENT",
    title: "Verdict",
    icon: "shield-alert",
    style: {
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(VerdictChip, {
    verdict: "malicious",
    size: "hero",
    solid: true,
    confidence: latestMalicious.confidence
  }), /*#__PURE__*/React.createElement(ConfidenceMeter, {
    value: latestMalicious.confidence,
    verdict: "malicious",
    segments: 20,
    size: "lg",
    width: 236,
    threshold: 0.8
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: '4px var(--space-10)',
      font: 'var(--type-data-dense)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "pattern"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-primary)'
    }
  }, latestMalicious.attack || 'Port scan'), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "source"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, latestMalicious.src), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "target"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, latestMalicious.dst), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "scored by"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, model)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "eye",
    fullWidth: true,
    onClick: () => onInspect(latestMalicious)
  }, "Inspect flow"))), /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "AGREEMENT",
    title: "All five models",
    meta: agreement.filter(a => a.verdict === 'malicious').length + '/5',
    icon: "layers",
    style: {
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, agreement.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      font: 'var(--type-data-dense)',
      color: a.id === model ? 'var(--text-primary)' : 'var(--text-muted)'
    }
  }, a.id), /*#__PURE__*/React.createElement(VerdictChip, {
    verdict: a.verdict
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(ConfidenceMeter, {
    value: a.confidence,
    verdict: a.verdict,
    threshold: 0.8,
    width: 48,
    size: "sm"
  })))))), /*#__PURE__*/React.createElement(InlineAlert, {
    tone: "warn",
    title: "svm-v1 disagrees"
  }, "One of five models scores this flow benign at 0.62. Treat the cluster, not the single flow, as the signal."));
}
function LiveFlows({
  model,
  onInspect,
  selectedId,
  paused,
  onPause
}) {
  const [flows, setFlows] = React.useState(() => window.CaughtData.seedFlows(26));
  const [tab, setTab] = React.useState('all');
  const [mode, setMode] = React.useState('Live');
  const [showBenign, setShowBenign] = React.useState(true);
  const [follow, setFollow] = React.useState(true);
  const [query, setQuery] = React.useState('');
  React.useEffect(() => {
    if (paused || mode !== 'Live') return undefined;
    const t = setInterval(() => {
      setFlows(prev => [window.CaughtData.makeFlow(), ...prev].slice(0, 70));
    }, 1100);
    return () => clearInterval(t);
  }, [paused, mode]);
  const visible = flows.filter(f => {
    if (tab === 'mal' && f.verdict !== 'malicious') return false;
    if (tab === 'low' && f.confidence >= 0.8) return false;
    if (!showBenign && f.verdict === 'benign') return false;
    return true;
  });
  const latestMalicious = flows.find(f => f.verdict === 'malicious') || flows[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 280px',
      gridTemplateRows: 'auto auto 1fr',
      gap: 'var(--space-12)',
      padding: 'var(--space-12)',
      height: '100%',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-12)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      value: 'all',
      label: 'All flows',
      count: flows.length
    }, {
      value: 'mal',
      label: 'Malicious',
      count: flows.filter(f => f.verdict === 'malicious').length
    }, {
      value: 'low',
      label: 'Below threshold',
      count: flows.filter(f => f.confidence < 0.8).length
    }]
  }), /*#__PURE__*/React.createElement(Tabs, {
    variant: "segmented",
    size: "sm",
    value: mode,
    onChange: setMode,
    tabs: ['Live', 'Replay']
  }), /*#__PURE__*/React.createElement(Input, {
    icon: "search",
    mono: true,
    size: "sm",
    placeholder: "proto=TCP and dst_port=445",
    value: query,
    onChange: e => setQuery(e.target.value),
    wrapperStyle: {
      width: 230
    },
    fullWidth: true
  }), /*#__PURE__*/React.createElement(Tag, {
    active: true,
    icon: "list-filter",
    onRemove: () => {}
  }, "src=10.4.19.22"), /*#__PURE__*/React.createElement(Tag, {
    mono: false,
    icon: "clock"
  }, "Last 15 min"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Show benign",
    checked: showBenign,
    onChange: setShowBenign
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Auto-scroll",
    checked: follow,
    onChange: setFollow
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: paused ? 'play' : 'pause',
    label: paused ? 'Resume capture' : 'Pause capture',
    variant: "secondary",
    onClick: onPause
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "download",
    label: "Export flows"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / 2'
    }
  }, /*#__PURE__*/React.createElement(KpiStrip, {
    flows: flows
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '2 / 3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    icon: "cpu",
    mono: true
  }, model)), /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "STREAM",
    title: mode === 'Live' ? 'Live flows' : 'Replay — capture-2026-08-12.pcap',
    icon: "activity",
    meta: visible.length + ' shown',
    flush: true,
    scroll: true,
    style: {
      gridColumn: '1 / 2',
      minHeight: 0
    },
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
      icon: "table-2",
      label: "Columns",
      size: "sm"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "refresh-cw",
      label: "Reset view",
      size: "sm"
    })),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, visible.length, " of ", flows.length, " flows"), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, paused ? 'stream paused' : 'appending ~1.1/s'))
  }, /*#__PURE__*/React.createElement(DataTable, {
    dense: true,
    animateNew: true,
    rowKey: "id",
    rows: visible,
    selectedKey: selectedId,
    columns: FLOW_COLUMNS(),
    onRowClick: onInspect,
    sortKey: "ts",
    sortDir: "desc",
    rowTone: r => r.verdict === 'malicious' ? 'alert' : r.confidence < 0.8 ? 'warn' : undefined
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '2 / 3',
      minHeight: 0,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(VerdictRail, {
    latestMalicious: latestMalicious,
    model: model,
    onInspect: onInspect
  })));
}
Object.assign(window, {
  LiveFlows,
  FLOW_COLUMNS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/LiveFlows.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Models.jsx
try { (() => {
const {
  Panel,
  Card,
  DataTable,
  MetricStat,
  Badge,
  Button,
  IconButton,
  Tabs,
  VerdictChip,
  ConfidenceMeter,
  Icon,
  InlineAlert,
  StatusDot
} = window.CaughtDesignSystem_eb3eb1;
function ModelCard({
  m,
  active,
  onSelect
}) {
  return /*#__PURE__*/React.createElement(Card, {
    interactive: true,
    selected: active,
    onClick: () => onSelect(m.id),
    padding: "var(--space-12)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      marginBottom: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-strong)',
      color: 'var(--text-primary)'
    }
  }, m.id), active ? /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    icon: "check"
  }, "active") : null, /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cpu",
    size: 13,
    color: active ? 'var(--accent)' : 'var(--text-faint)'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-ui)',
      fontWeight: 400,
      color: 'var(--text-secondary)',
      marginBottom: 'var(--space-4)'
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-data-dense)',
      fontSize: 'var(--fs-10)',
      color: 'var(--text-faint)',
      marginBottom: 'var(--space-12)'
    }
  }, m.arch), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    label: "F1",
    value: m.f1.toFixed(3),
    size: "sm"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Latency",
    value: m.latency.toFixed(1),
    unit: "ms",
    size: "sm"
  })));
}
function Models({
  model,
  onRequestSwitch
}) {
  const models = window.CaughtData.models;
  const [sel, setSel] = React.useState(model);
  const [view, setView] = React.useState('Scorecards');
  const current = models.find(m => m.id === sel) || models[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)',
      padding: 'var(--space-12)',
      height: '100%',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    variant: "segmented",
    size: "sm",
    value: view,
    onChange: setView,
    tabs: ['Scorecards', 'Comparison']
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontWeight: 400,
      fontSize: 'var(--fs-11)',
      color: 'var(--text-faint)'
    }
  }, "Five models trained on CIC-IDS2017. Switching takes effect from the next flow."), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 'var(--space-8)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    tone: "live",
    mono: true,
    label: model + ' scoring'
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "arrow-left-right",
    disabled: sel === model,
    onClick: () => onRequestSwitch(sel)
  }, sel === model ? 'Already active' : 'Switch to ' + sel))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5,1fr)',
      gap: 'var(--space-12)'
    }
  }, models.map(m => /*#__PURE__*/React.createElement(ModelCard, {
    key: m.id,
    m: m,
    active: m.id === sel,
    onSelect: setSel
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: 'var(--space-12)',
      flex: '1 1 auto',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "EVALUATION",
    title: "Held-out test set",
    meta: "284,315 flows",
    icon: "gauge",
    flush: true,
    scroll: true,
    actions: /*#__PURE__*/React.createElement(IconButton, {
      icon: "download",
      label: "Export metrics",
      size: "sm"
    }),
    footer: /*#__PURE__*/React.createElement("span", null, "Metrics from the 2026-08-02 evaluation run \xB7 20% held-out split")
  }, /*#__PURE__*/React.createElement(DataTable, {
    rowKey: "id",
    rows: models,
    selectedKey: sel,
    onRowClick: r => setSel(r.id),
    columns: [{
      key: 'id',
      label: 'Model',
      width: '84px',
      emphasis: true
    }, {
      key: 'name',
      label: 'Architecture',
      width: '170px',
      mono: false,
      muted: true,
      render: r => r.name + ' · ' + r.arch
    }, {
      key: 'precision',
      label: 'Precision',
      width: '84px',
      align: 'right',
      render: r => r.precision.toFixed(3)
    }, {
      key: 'recall',
      label: 'Recall',
      width: '76px',
      align: 'right',
      render: r => r.recall.toFixed(3)
    }, {
      key: 'f1',
      label: 'F1',
      width: '72px',
      align: 'right',
      emphasis: true,
      render: r => r.f1.toFixed(3)
    }, {
      key: 'latency',
      label: 'Latency',
      width: '78px',
      align: 'right',
      render: r => r.latency.toFixed(1) + 'ms'
    }, {
      key: 'size',
      label: 'Size',
      width: '78px',
      align: 'right',
      muted: true
    }, {
      key: 'trained',
      label: 'Trained',
      width: '92px',
      muted: true
    }, {
      key: 'state',
      label: '',
      width: '76px',
      render: r => r.id === model ? /*#__PURE__*/React.createElement(Badge, {
        tone: "accent"
      }, "scoring") : /*#__PURE__*/React.createElement(Badge, {
        tone: "quiet"
      }, "loaded")
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)',
      minHeight: 0,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "SELECTED",
    title: current.id,
    icon: "cpu"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    label: "Precision",
    value: current.precision.toFixed(3)
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Recall",
    value: current.recall.toFixed(3)
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "F1",
    value: current.f1.toFixed(3)
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Latency",
    value: current.latency.toFixed(1),
    unit: "ms"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: '4px var(--space-10)',
      font: 'var(--type-data-dense)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "trained"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, current.trained), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "artifact"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, current.id, ".joblib \xB7 ", current.size), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "features"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, "14 flow statistics")))), /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "SAMPLE",
    title: "Verdict on the same flow",
    icon: "scan-line"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, window.CaughtData.agreement.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      font: 'var(--type-data-dense)',
      color: a.id === sel ? 'var(--text-primary)' : 'var(--text-muted)'
    }
  }, a.id), /*#__PURE__*/React.createElement(VerdictChip, {
    verdict: a.verdict
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(ConfidenceMeter, {
    value: a.confidence,
    verdict: a.verdict,
    threshold: 0.8,
    width: 54,
    size: "sm"
  })))))), /*#__PURE__*/React.createElement(InlineAlert, {
    tone: "quiet",
    title: "knn-v3 is 10\xD7 slower than rf-v4"
  }, "Latency above 8 ms/flow will not keep up with a 1.2 Gbps link."))));
}
Object.assign(window, {
  Models
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Models.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Sources.jsx
try { (() => {
const {
  Panel,
  Radio,
  Select,
  Input,
  Switch,
  Checkbox,
  Button,
  Badge,
  StatusDot,
  MetricStat,
  InlineAlert,
  Tag,
  IconButton,
  DataTable
} = window.CaughtDesignSystem_eb3eb1;
function Sources() {
  const [src, setSrc] = React.useState('live');
  const [iface, setIface] = React.useState('eth0');
  const [rate, setRate] = React.useState('1x');
  const [toasts, setToasts] = React.useState(true);
  const [sound, setSound] = React.useState(false);
  const [dropBenign, setDropBenign] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      gap: 'var(--space-12)',
      padding: 'var(--space-12)',
      height: '100%',
      minHeight: 0,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "CAPTURE",
    title: "Source",
    icon: "route",
    actions: /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      mono: true
    }, src === 'live' ? iface : 'replay'),
    footer: /*#__PURE__*/React.createElement("span", null, "Changing the source restarts the flow assembler \xB7 in-flight flows are discarded")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement(Radio, {
    name: "src",
    label: "Live interface",
    hint: "Capture from a network interface on this host",
    checked: src === 'live',
    onChange: () => setSrc('live')
  }), /*#__PURE__*/React.createElement(Radio, {
    name: "src",
    label: "Replay a capture file",
    hint: "Score a PCAP at a chosen rate \u2014 used for demos and regression runs",
    checked: src === 'pcap',
    onChange: () => setSrc('pcap')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-12)',
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }
  }, src === 'live' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Select, {
    label: "Interface",
    mono: true,
    value: iface,
    onChange: setIface,
    options: ['eth0', 'eth1', 'wlan0', 'any']
  }), /*#__PURE__*/React.createElement(Input, {
    label: "BPF filter",
    mono: true,
    defaultValue: "ip and not port 22",
    wrapperStyle: {
      width: 240
    },
    fullWidth: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Flow timeout",
    defaultValue: "120",
    suffix: "s",
    size: "md",
    wrapperStyle: {
      width: 110
    },
    fullWidth: true
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input, {
    label: "Capture file",
    mono: true,
    defaultValue: "capture-2026-08-12.pcap",
    wrapperStyle: {
      width: 260
    },
    fullWidth: true
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Replay rate",
    mono: true,
    value: rate,
    onChange: setRate,
    options: ['0.5x', '1x', '2x', '5x', 'as fast as possible']
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Start offset",
    mono: true,
    defaultValue: "00:00:00",
    wrapperStyle: {
      width: 120
    },
    fullWidth: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "play"
  }, "Apply and start"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Discard changes"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "caution",
    icon: "ban"
  }, "Stop capture"))))), /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "SCORING",
    title: "Verdict handling",
    icon: "sliders-horizontal"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Alert threshold",
    defaultValue: "0.80",
    suffix: "conf",
    wrapperStyle: {
      width: 150
    },
    fullWidth: true,
    hint: "Below this, verdicts are shown in amber and excluded from alert clusters"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Cluster window",
    defaultValue: "5",
    suffix: "min",
    wrapperStyle: {
      width: 150
    },
    fullWidth: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Toast on new alert cluster",
    checked: toasts,
    onChange: setToasts
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Audible alert",
    checked: sound,
    onChange: setSound
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Drop benign flows from the store",
    hint: "Keeps the flow table light on long shifts",
    checked: dropBenign,
    onChange: setDropBenign
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Log every verdict to disk",
    checked: true,
    hint: "JSONL, rotated hourly"
  })))), /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "HISTORY",
    title: "Recent sources",
    icon: "clock",
    flush: true
  }, /*#__PURE__*/React.createElement(DataTable, {
    dense: true,
    rowKey: "id",
    rows: [{
      id: 's1',
      when: '14:21:04',
      kind: 'live',
      detail: 'eth0 · ip and not port 22',
      flows: '12,481',
      state: 'active'
    }, {
      id: 's2',
      when: '13:02:55',
      kind: 'replay',
      detail: 'capture-2026-08-12.pcap · 2x',
      flows: '84,220',
      state: 'finished'
    }, {
      id: 's3',
      when: '11:47:10',
      kind: 'live',
      detail: 'wlan0 · ip',
      flows: '6,004',
      state: 'stopped'
    }],
    columns: [{
      key: 'when',
      label: 'Started',
      width: '90px',
      muted: true
    }, {
      key: 'kind',
      label: 'Kind',
      width: '72px'
    }, {
      key: 'detail',
      label: 'Detail',
      width: 'auto'
    }, {
      key: 'flows',
      label: 'Flows',
      width: '84px',
      align: 'right'
    }, {
      key: 'state',
      label: 'State',
      width: '90px',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.state === 'active' ? 'accent' : 'quiet'
      }, r.state)
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "HEALTH",
    title: "Capture",
    icon: "gauge",
    actions: /*#__PURE__*/React.createElement(IconButton, {
      icon: "refresh-cw",
      label: "Refresh",
      size: "sm"
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    tone: "live",
    pulse: true,
    mono: true,
    label: "eth0 \xB7 1.24 Gbps"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    label: "Packets / sec",
    value: "184k"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Flows / sec",
    value: "1,284"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Dropped",
    value: "0.02",
    unit: "%"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    label: "Assembler queue",
    value: "0"
  })))), /*#__PURE__*/React.createElement(InlineAlert, {
    tone: "warn",
    title: "Replay buffer reached 84% at 13:41"
  }, "The capture was read faster than knn-v3 could score it. Lower the replay rate or pick a faster model."), /*#__PURE__*/React.createElement(Panel, {
    eyebrow: "INTERFACES",
    title: "Detected",
    icon: "network",
    flush: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, [['eth0', '1.24 Gbps', 'live'], ['eth1', 'idle', 'idle'], ['wlan0', 'idle', 'idle'], ['lo', 'ignored', 'offline']].map(([n, r, t]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      height: 28,
      padding: '0 var(--space-12)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    tone: t,
    size: 5
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-data-strong)',
      color: 'var(--text-body)'
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      font: 'var(--type-data-dense)',
      color: 'var(--text-faint)'
    }
  }, r))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    icon: "lock"
  }, "tls decrypt off"), /*#__PURE__*/React.createElement(Tag, {
    icon: "database"
  }, "store 14 d"), /*#__PURE__*/React.createElement(Tag, {
    icon: "terminal"
  }, "api :8080"))));
}
Object.assign(window, {
  Sources
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Sources.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/data.js
try { (() => {
/* Fake but plausible fixtures for the Caught console kit. Deterministic PRNG so
   the screens look identical on every load. */
(function () {
  function mulberry32(a) {
    return function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(20260812);
  const pick = a => a[Math.floor(rnd() * a.length)];
  const models = [{
    id: 'rf-v4',
    name: 'Random forest',
    arch: '120 trees, depth 18',
    precision: 0.984,
    recall: 0.978,
    f1: 0.981,
    latency: 1.2,
    size: '14.2 MB',
    trained: '2026-07-28',
    active: true
  }, {
    id: 'xgb-v2',
    name: 'Gradient boosting',
    arch: '400 rounds, lr 0.08',
    precision: 0.991,
    recall: 0.969,
    f1: 0.980,
    latency: 2.4,
    size: '8.9 MB',
    trained: '2026-08-02'
  }, {
    id: 'mlp-v1',
    name: 'Neural net',
    arch: '3 × 128 dense',
    precision: 0.962,
    recall: 0.981,
    f1: 0.971,
    latency: 3.8,
    size: '4.1 MB',
    trained: '2026-07-14'
  }, {
    id: 'knn-v3',
    name: 'k-nearest',
    arch: 'k = 9, ball tree',
    precision: 0.948,
    recall: 0.933,
    f1: 0.940,
    latency: 11.6,
    size: '96.4 MB',
    trained: '2026-06-30'
  }, {
    id: 'svm-v1',
    name: 'Linear SVM',
    arch: 'hinge, C = 1.0',
    precision: 0.937,
    recall: 0.902,
    f1: 0.919,
    latency: 0.7,
    size: '1.8 MB',
    trained: '2026-06-11'
  }];
  const benign = [['192.168.8.14', 44012, '93.184.216.34', 443, 'TCP', 'HTTPS'], ['192.168.8.31', 5353, '224.0.0.251', 5353, 'UDP', 'MDNS'], ['192.168.8.9', 51888, '10.4.2.4', 53, 'UDP', 'DNS'], ['192.168.8.52', 60122, '172.217.16.14', 443, 'TCP', 'HTTPS'], ['10.4.7.18', 47712, '10.4.2.11', 3306, 'TCP', 'MYSQL'], ['192.168.8.77', 39104, '151.101.1.69', 443, 'TCP', 'HTTPS'], ['10.4.7.4', 22, '10.4.19.8', 55210, 'TCP', 'SSH'], ['192.168.8.23', 137, '192.168.8.255', 137, 'UDP', 'NBNS']];
  const malicious = [['10.4.19.22', 51204, '10.4.2.9', 445, 'TCP', 'SMB'], ['10.4.19.22', 51203, '10.4.2.9', 139, 'TCP', 'NBSS'], ['10.4.19.22', 51209, '10.4.2.9', 3389, 'TCP', 'RDP'], ['45.83.220.14', 6667, '10.4.7.31', 49402, 'TCP', 'IRC'], ['10.4.19.22', 51216, '10.4.2.9', 22, 'TCP', 'SSH']];
  const attacks = ['Port scan', 'SMB brute force', 'DoS Hulk', 'Botnet C2', 'Brute force — SSH'];
  /* Keep the label consistent with the flow it is attached to. */
  const attackFor = {
    445: 'SMB brute force',
    139: 'SMB brute force',
    3389: 'Port scan',
    22: 'Brute force — SSH',
    49402: 'Botnet C2'
  };
  let seq = 4820;
  const pad = (n, w) => String(n).padStart(w, '0');
  function stamp(d) {
    return pad(d.getHours(), 2) + ':' + pad(d.getMinutes(), 2) + ':' + pad(d.getSeconds(), 2) + '.' + pad(d.getMilliseconds(), 3);
  }
  function makeFlow(when) {
    const bad = rnd() < 0.13;
    const row = bad ? pick(malicious) : pick(benign);
    const conf = bad ? 0.86 + rnd() * 0.13 : rnd() < 0.12 ? 0.58 + rnd() * 0.2 : 0.9 + rnd() * 0.099;
    const d = when || new Date();
    return {
      id: 'f' + seq++,
      ts: stamp(d),
      src: row[0] + ':' + row[1],
      dst: row[2] + ':' + row[3],
      srcIp: row[0],
      dstIp: row[2],
      dstPort: row[3],
      proto: row[4],
      service: row[5],
      pkts: 6 + Math.floor(rnd() * 240),
      bytes: (bad ? 380 : 1200) + Math.floor(rnd() * 24000),
      dur: (bad ? 4 : 60) + Math.floor(rnd() * 900),
      verdict: bad ? 'malicious' : 'benign',
      attack: bad ? attackFor[row[3]] || 'Port scan' : null,
      confidence: Number(conf.toFixed(2)),
      isNew: true
    };
  }
  function seedFlows(n) {
    const out = [];
    const now = Date.now();
    for (let i = n; i > 0; i--) {
      const f = makeFlow(new Date(now - i * 820));
      f.isNew = false;
      out.push(f);
    }
    return out.reverse();
  }

  /* Feature contributions shown in the flow detail drawer. */
  const features = [{
    key: 'dst_port',
    label: 'Destination port',
    value: '445',
    weight: 0.31
  }, {
    key: 'flow_iat_std',
    label: 'IAT std dev',
    value: '0.004 s',
    weight: 0.24
  }, {
    key: 'syn_flag_cnt',
    label: 'SYN flags',
    value: '42',
    weight: 0.18
  }, {
    key: 'fwd_pkt_len_mean',
    label: 'Fwd pkt len mean',
    value: '58.2 B',
    weight: 0.11
  }, {
    key: 'flow_duration',
    label: 'Flow duration',
    value: '11 ms',
    weight: 0.09
  }, {
    key: 'bwd_pkts',
    label: 'Backward packets',
    value: '0',
    weight: 0.07
  }];
  const alerts = [{
    id: 'a1',
    host: '10.4.19.22',
    pattern: 'Port scan',
    flows: 42,
    window: '00:31',
    peak: 0.97,
    first: '14:21:36',
    target: '10.4.2.9',
    state: 'open'
  }, {
    id: 'a2',
    host: '45.83.220.14',
    pattern: 'Botnet C2',
    flows: 6,
    window: '04:12',
    peak: 0.93,
    first: '14:18:04',
    target: '10.4.7.31',
    state: 'open'
  }, {
    id: 'a3',
    host: '10.4.19.22',
    pattern: 'SMB brute force',
    flows: 18,
    window: '01:47',
    peak: 0.96,
    first: '14:12:51',
    target: '10.4.2.9',
    state: 'ack'
  }, {
    id: 'a4',
    host: '192.168.8.66',
    pattern: 'DoS Hulk',
    flows: 311,
    window: '02:03',
    peak: 0.99,
    first: '13:58:20',
    target: '10.4.2.20',
    state: 'closed'
  }];
  const agreement = [{
    id: 'rf-v4',
    verdict: 'malicious',
    confidence: 0.97
  }, {
    id: 'xgb-v2',
    verdict: 'malicious',
    confidence: 0.95
  }, {
    id: 'mlp-v1',
    verdict: 'malicious',
    confidence: 0.91
  }, {
    id: 'knn-v3',
    verdict: 'malicious',
    confidence: 0.74
  }, {
    id: 'svm-v1',
    verdict: 'benign',
    confidence: 0.62
  }];
  window.CaughtData = {
    models,
    makeFlow,
    seedFlows,
    features,
    alerts,
    agreement,
    attacks
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.ConfidenceMeter = __ds_scope.ConfidenceMeter;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.MetricStat = __ds_scope.MetricStat;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.VerdictChip = __ds_scope.VerdictChip;

__ds_ns.InlineAlert = __ds_scope.InlineAlert;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.Tooltip = __ds_scope.Tooltip;

})();

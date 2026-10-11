import React from 'react';

const colorThemes = {
  blue: {
    bg: 'bg-blue-50/70',
    iconBg: 'bg-blue-600',
    iconText: 'text-white',
    ring: 'border-blue-100',
    accentText: 'text-blue-600'
  },
  emerald: {
    bg: 'bg-emerald-50/70',
    iconBg: 'bg-emerald-600',
    iconText: 'text-white',
    ring: 'border-emerald-100',
    accentText: 'text-emerald-600'
  },
  amber: {
    bg: 'bg-amber-50/70',
    iconBg: 'bg-amber-500',
    iconText: 'text-white',
    ring: 'border-amber-100',
    accentText: 'text-amber-600'
  },
  purple: {
    bg: 'bg-purple-50/70',
    iconBg: 'bg-purple-600',
    iconText: 'text-white',
    ring: 'border-purple-100',
    accentText: 'text-purple-600'
  }
};

const StatCard = ({ title, value, icon: Icon, subtitle, theme = 'blue', trend }) => {
  const currentTheme = colorThemes[theme] || colorThemes.blue;

  return (
    <div className={`
      relative overflow-hidden bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs
      hover:shadow-md hover:border-slate-300 transition-all duration-200 group
    `}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${currentTheme.iconBg} ${currentTheme.iconText} group-hover:scale-105 transition-transform duration-200`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          {subtitle}
        </span>
        {trend && (
          <span className={`font-semibold ${currentTheme.accentText}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Decorative subtle background corner glow */}
      <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full ${currentTheme.bg} -z-1 opacity-60 group-hover:scale-125 transition-transform duration-300`} />
    </div>
  );
};

export default StatCard;

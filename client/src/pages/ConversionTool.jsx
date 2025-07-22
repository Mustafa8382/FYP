import React, { useState } from 'react';
import Footer from '../components/Footer.jsx';
import { motion } from 'framer-motion';

const unitFactors = {
  sqft: { sqm: 0.092903, marla: 1 / 272.25, kanal: 1 / 5445, acre: 1 / 43560, hectare: 1 / 107639.1 },
  marla: { sqft: 272.25, kanal: 1 / 20, acre: 272.25 / 43560, hectare: 272.25 / 107639.1 },
  kanal: { sqft: 5445, marla: 20, acre: 5445 / 43560, hectare: 5445 / 107639.1 },
  sqm: { sqft: 10.7639, marla: 10.7639 / 272.25, kanal: 10.7639 / 5445, acre: 10.7639 / 43560, hectare: 10.7639 / 107639.1 },
};

const allUnits = Object.keys(unitFactors);

const labels = {
  en: {
    heading: '📐 AM Area Wizard',
    placeholder: 'Enter a value...',
    selectUnit: 'Select Unit',
    toggleLang: 'اردو',
    unitLabels: {
      sqft: 'SQFT', sqm: 'SQM', marla: 'Marla', kanal: 'Kanal', acre: 'Acre', hectare: 'Hectare',
    },
  },
  ur: {
    heading: '📐اے ایم ایریا وزرڈ',
    placeholder: 'قدر درج کریں...',
    selectUnit: 'اکائی منتخب کریں',
    toggleLang: 'ENGLISH',
    unitLabels: {
      sqft: 'مربع فٹ', sqm: 'مربع میٹر', marla: 'مرلہ', kanal: 'کنال', acre: 'ایکڑ', hectare: 'ہیکٹر',
    },
  },
};

const ConversionTool = () => {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('sqft');
  const [lang, setLang] = useState('en');

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return {};
    const factorSet = unitFactors[fromUnit];
    const result = {};
    for (const [toUnit, factor] of Object.entries(factorSet)) {
      result[toUnit] = (num * factor).toFixed(4);
    }
    return result;
  };

  const results = convert();
  const t = labels[lang];
  const urduFont = lang === 'ur' ? 'font-[Jameel Noori Nastaleeq]' : '';

  return (
    <section className="bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 ">
      <div className="max-w-5xl mx-auto px-4 mt-14">
        {/* Heading & Language Toggle */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mb-8 text-center sm:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white ${urduFont} break-words text-wrap`}>
            {t.heading}
          </motion.h1>
          <button
            onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow transition">
            {t.toggleLang}
          </button>
        </div>

        {/* Input & Unit Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 md:items-center justify-center mb-8">
            <input
              type="number"
              className={`w-full md:w-2/5 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white text-lg ${urduFont}`}
              placeholder={t.placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <select
              className={`w-full md:w-1/3 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white text-lg ${urduFont}`}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {allUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {t.unitLabels[unit]}
                </option>
              ))}
            </select>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Object.entries(results).map(([unit, val], index) => (
              <motion.div
                key={unit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-blue-50/80 dark:bg-gray-700/70 rounded-2xl p-5 text-center shadow-lg hover:shadow-2xl transition transform hover:scale-105"
              >
                <div className={`uppercase text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 ${urduFont}`}>
                  {t.unitLabels[unit]}
                </div>
                <div className={`text-2xl font-bold text-slate-800 dark:text-white ${urduFont}`}>{val}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-64">
        <Footer />
      </div>
    </section>
  );
};

export default ConversionTool;

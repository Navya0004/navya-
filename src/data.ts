/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, ReservationItem } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'KL-990-R2',
    name: 'Kinetic Core R2',
    price: 1299.00,
    description: 'Enterprise-grade network gateway with integrated ledger synchronization and real-time latency monitoring.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAczpHrKcfHTanUWItIM_yEmQ2DDaA4srVB_fMaulX1h-tcvW4AQWl1598BMp3kYvhezVLin5ve5C4O5i1zJMvxbYV92JWbbydbDi5lGZSArf4_76wkUT_6oDJmN6os105rgPYKpAMUeKsJiRWUwela_qGOmozQJTRE0Pw8bMgrn401FDN4T0Q3xMP2Qm7MH_smneZNWKc2lEoiC6_iHlppk3ibVRC-xrsBldB3ULVys3-StiweznzkA_EhI1vDCaoZcMu80MVxdpVv',
    category: 'Network Gateway',
    stockStatus: 'High Stock',
    distribution: [
      { name: 'Hub Alpha (Frankfurt)', stock: 412 },
      { name: 'Hub Beta (Singapore)', stock: 588 }
    ],
    totalStock: 1200,
    reservedStock: 200
  },
  {
    id: 'KL-SYN-X',
    name: 'Synapse Module',
    price: 450.00,
    description: 'Neural processing unit for distributed ledger verification. High-efficiency cooling required.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHZGraSMVDY4S7Ep_FnLfTM7zcrxanVyMPv5xcTstb00gII3WYCJyMSC59KGtF0pbRZtTOgVG8nfoKoEaXmvJvyQf_Qej8A9PB3WqME_bSsXz5hXQ7a1lJeNRdWjeETNwXElo3pA129GNGhkUgWwALVB4aWz1D5TybBfuB63bvmBMxe4JE916MSNL0_ErlQLyeXe-FJEbgp-76xmPV-ix6QID4HAgmgtIkYYDtciyjbIvXA1hM0OykRC2NQRxx4HpbJwtTC8sgvRL0',
    category: 'NPU Accelerators',
    stockStatus: 'Low Stock',
    distribution: [
      { name: 'Hub Alpha (Frankfurt)', stock: 12 },
      { name: 'Hub Gamma (New York)', stock: 3 }
    ],
    totalStock: 45,
    reservedStock: 30
  },
  {
    id: 'KL-VFC-7',
    name: 'Vector Flux Capacitor',
    price: 2850.00,
    description: 'High-frequency energy stabilization module for large-scale operations. Backorder expected in 14 days.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOleq9bOWqGTs-PP2RGJNUAFPPc5hePoRMGfIaLBHglX6ryYkUtSMRs3g21o4RUi3FygnyQA7n48qEO2_JYdtgRr6NflXg_yn1nJyZiEPxnZDRf2cU3Ze1sVH-5EvB7EpC2-HbtC4pcP2oBAdh3RtCojWIsDYU4TH_pMApTttfWBLas79-r7zyCDQqAk5E3UyT1v9JIPQZuEr15aPMuiEP1YkLd_WYe0zOudYVxwpYHwXLvLhfTCnxEhl-FXVbV47F2bBFyiwBTQ-e',
    category: 'Energy Modules',
    stockStatus: 'Out of Stock',
    distribution: [
      { name: 'Hub Delta (Tokyo)', stock: 0 }
    ],
    totalStock: 10,
    reservedStock: 10
  },
  {
    id: 'KL-9923-AP',
    name: 'Alpha-9 Microprocessor',
    price: 890.00,
    description: 'Autonomous micro-processor suite for real-time edge encryption and local data-ledger anchoring.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArOgzaTrG00ghZEDDvL_T75U5ZPb6k41r5L8rD0OxOon2-ybq84Vokv5p8-QfnLawcxTwTp5p14sGlhuYhTaxW6dtX4AcEwH4s1UnC1FPoLEQCF_7YN9rHoOI_0iZk4apiVkSohcXtXkCjXYc_qCfvalaWsMnM1YbhFtK4XdOblk49HVEXq19kHdM2sYWv_-KzwzI98-zqmccrm81h0Oj9dd9veRICbGffEAg1aolUwU5GgypRMAMCILEM3lIq8sgFeHcqLvAAsTVK',
    category: 'Edge Computing',
    stockStatus: 'High Stock',
    distribution: [
      { name: 'Hub Beta (Singapore)', stock: 850 },
      { name: 'Hub Delta (Tokyo)', stock: 650 }
    ],
    totalStock: 1800,
    reservedStock: 300
  },
  {
    id: 'KL-1142-TC',
    name: 'Thermal Casting Shell',
    price: 240.00,
    description: 'Structural heat dispersion alloy casing designed to shield high-velocity processing clusters.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcibQBSCRahKOc1z7nMtelJ3gFRmLq90JlNR9SoqHLxCuwdnEXveNA1srGzlOhGUOpyAaC2h_aYlrIeEJwB5xBNrBI1WEN6zqvwkntbFr383YGDcN8xWfD7t6uSjclW3oxqVadTexN7m-cfwXIZOdPbIUMQ8aukuDxSK3iNj6dcZxVhWXAmYhp6CXPrHlhkhtSEVoXEpdONv2jWA-KjlWp4J2nR84oBbp1luNfP63T0QdulodPo7X7jAbmzXHlSQe7gMvZZB2Ham0O',
    category: 'Thermals & Shells',
    stockStatus: 'Low Stock',
    distribution: [
      { name: 'Hub Gamma (New York)', stock: 15 },
      { name: 'Hub Alpha (Frankfurt)', stock: 5 }
    ],
    totalStock: 100,
    reservedStock: 80
  },
  {
    id: 'KL-QEG-9',
    name: 'Quantum Cryo Gateway',
    price: 3450.00,
    description: 'Cryogenic quantum processor logic bank optimized for aerospace secure storage nodes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAczpHrKcfHTanUWItIM_yEmQ2DDaA4srVB_fMaulX1h-tcvW4AQWl1598BMp3kYvhezVLin5ve5C4O5i1zJMvxbYV92JWbbydbDi5lGZSArf4_76wkUT_6oDJmN6os105rgPYKpAMUeKsJiRWUwela_qGOmozQJTRE0Pw8bMgrn401FDN4T0Q3xMP2Qm7MH_smneZNWKc2lEoiC6_iHlppk3ibVRC-xrsBldB3ULVys3-StiweznzkA_EhI1vDCaoZcMu80MVxdpVv',
    category: 'Network Gateway',
    stockStatus: 'High Stock',
    distribution: [
      { name: 'Hub Gamma (New York)', stock: 100 },
      { name: 'Hub Delta (Tokyo)', stock: 120 }
    ],
    totalStock: 300,
    reservedStock: 80
  },
  {
    id: 'KL-OPS-44',
    name: 'Optic Routing Core',
    price: 1550.00,
    description: 'High-density fiber interface unit with fast hardware error-correcting matrices built-in.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHZGraSMVDY4S7Ep_FnLfTM7zcrxanVyMPv5xcTstb00gII3WYCJyMSC59KGtF0pbRZtTOgVG8nfoKoEaXmvJvyQf_Qej8A9PB3WqME_bSsXz5hXQ7a1lJeNRdWjeETNwXElo3pA129GNGhkUgWwALVB4aWz1D5TybBfuB63bvmBMxe4JE916MSNL0_ErlQLyeXe-FJEbgp-76xmPV-ix6QID4HAgmgtIkYYDtciyjbIvXA1hM0OykRC2NQRxx4HpbJwtTC8sgvRL0',
    category: 'Network Gateway',
    stockStatus: 'High Stock',
    distribution: [
      { name: 'Hub Beta (Singapore)', stock: 320 },
      { name: 'Hub Alpha (Frankfurt)', stock: 180 }
    ],
    totalStock: 600,
    reservedStock: 100
  },
  {
    id: 'KL-MAG-N8',
    name: 'Mag-Lev Stabilizer',
    price: 1999.00,
    description: 'Magnetic suspension bracket for cooling high-velocity rotating storage systems in severe heat.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOleq9bOWqGTs-PP2RGJNUAFPPc5hePoRMGfIaLBHglX6ryYkUtSMRs3g21o4RUi3FygnyQA7n48qEO2_JYdtgRr6NflXg_yn1nJyZiEPxnZDRf2cU3Ze1sVH-5EvB7EpC2-HbtC4pcP2oBAdh3RtCojWIsDYU4TH_pMApTttfWBLas79-r7zyCDQqAk5E3UyT1v9JIPQZuEr15aPMuiEP1YkLd_WYe0zOudYVxwpYHwXLvLhfTCnxEhl-FXVbV47F2bBFyiwBTQ-e',
    category: 'Thermals & Shells',
    stockStatus: 'Low Stock',
    distribution: [
      { name: 'Hub Delta (Tokyo)', stock: 8 },
      { name: 'Hub Gamma (New York)', stock: 2 }
    ],
    totalStock: 20,
    reservedStock: 10
  }
];

export const DEFAULT_RESERVATIONS: ReservationItem[] = [
  {
    id: 'KL-9923-AP',
    name: 'Alpha-9 Microprocessor',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArOgzaTrG00ghZEDDvL_T75U5ZPb6k41r5L8rD0OxOon2-ybq84Vokv5p8-QfnLawcxTwTp5p14sGlhuYhTaxW6dtX4AcEwH4s1UnC1FPoLEQCF_7YN9rHoOI_0iZk4apiVkSohcXtXkCjXYc_qCfvalaWsMnM1YbhFtK4XdOblk49HVEXq19kHdM2sYWv_-KzwzI98-zqmccrm81h0Oj9dd9veRICbGffEAg1aolUwU5GgypRMAMCILEM3lIq8sgFeHcqLvAAsTVK',
    warehouse: 'WH-02 (Central Hub)',
    quantity: 2500,
    priceUnit: 890.00
  },
  {
    id: 'KL-1142-TC',
    name: 'Thermal Casting Shell',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcibQBSCRahKOc1z7nMtelJ3gFRmLq90JlNR9SoqHLxCuwdnEXveNA1srGzlOhGUOpyAaC2h_aYlrIeEJwB5xBNrBI1WEN6zqvwkntbFr383YGDcN8xWfD7t6uSjclW3oxqVadTexN7m-cfwXIZOdPbIUMQ8aukuDxSK3iNj6dcZxVhWXAmYhp6CXPrHlhkhtSEVoXEpdONv2jWA-KjlWp4J2nR84oBbp1luNfP63T0QdulodPo7X7jAbmzXHlSQe7gMvZZB2Ham0O',
    warehouse: 'WH-04 (West Coastal)',
    quantity: 480,
    priceUnit: 240.00
  }
];

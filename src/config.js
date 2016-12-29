// api root
const HOST = 'http://127.0.0.1:3000';
export const CDN_ROOT = HOST;
export const API_ROOT = `${HOST}/api/v1`;
export const SiteName = 'CUIT ACM Meter';

export const NavbarMenu = [
  {
    to: '/meter/main',
    text: '主页',
    children: []
  },
  {
    to: '/meter/status',
    text: '训练提交',
    children: []
  },
];

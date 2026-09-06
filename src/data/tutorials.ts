export interface TutorialSection {
  id: string;
  title: string;
  category: 'guide' | 'print' | 'design';
  readTime: string;
  icon: string;
  summary: string;
  content: {
    heading: string;
    text: string;
    tips?: string[];
  }[];
}

export const TUTORIALS: TutorialSection[] = [
  {
    id: 'print-standard',
    title: '名片印刷标准与300DPI出血线全解析',
    category: 'print',
    readTime: '3 分钟',
    icon: 'Printer',
    summary: '了解为什么线下印刷厂需要 3mm 出血线和 300DPI 矢量/高清 PDF。',
    content: [
      {
        heading: '1. 什么是标准名片尺寸与出血线？',
        text: '国内通用名片成品标准尺寸为 90mm × 54mm。然而在印刷厂裁切过程中，机械可能会产生 ±1~2mm 的微小偏移。因此我们在设计四周预留了 3mm 的「出血区」（含出血设计尺寸为 96mm × 60mm）。',
        tips: [
          '导出时勾选「包含3mm印刷出血线与十字裁切标记」',
          '重要文字与二维码请放置在安全线以内（距离边缘至少 4mm）',
        ],
      },
      {
        heading: '2. 为什么选择 300 DPI 高清 PDF？',
        text: '屏幕显示通常为 72 DPI，而商业印刷机需要至少 300 DPI 的精度才能保证细小文字、细线条不发虚。美序名片在本地直接将设计渲染为 300 DPI 印刷级 PDF，无压缩失真。',
        tips: [
          '印刷时直接把导出的 PDF 发送给印刷店或上传到淘宝/京东名片印制平台',
          '普通社交与微信分享可导出 2K / 4K PNG 图片',
        ],
      },
    ],
  },
  {
    id: 'design-golden-rules',
    title: '名片设计的「三大黄金法则」',
    category: 'design',
    readTime: '2 分钟',
    icon: 'Sparkles',
    summary: '如何排版出高级、克制、令人印象深刻的商务与个人名片。',
    content: [
      {
        heading: '1. 信息层级：少即是多 (Less is More)',
        text: '名片不是传单。第一眼让对方看到「你是谁」与「你的核心价值」，其次才是电话、微信与二维码等联系路径。',
        tips: [
          '姓名与头衔保持 2:1 的字号对比比例',
          '联系方式建议统一字体与字号，整齐左对齐或居中',
        ],
      },
      {
        heading: '2. 善用网格与正负空间留白',
        text: '高级感的秘诀在于克制。给元素充足的呼吸空间，不要把整个卡片填满，让核心信息自然成为视觉焦点。',
      },
      {
        heading: '3. 善用二维码连接数字资产',
        text: '通过名片上的二维码，可以承载电子名片、个人作品集网站、微信好友二维码或企业官网，让传统纸质名片成为数字入口。',
      },
    ],
  },
  {
    id: 'app-user-guide',
    title: '美序名片全功能使用指南',
    category: 'guide',
    readTime: '2 分钟',
    icon: 'Smartphone',
    summary: '从选模板到导出印刷：替换文字 / 底图 / 二维码、画布手势、保存与导出全流程。',
    content: [
      {
        heading: '1. 三步完成一张名片',
        text: '在「模板库」点击喜欢的模板进入编辑器（也可点「新建空白」从零开始），通过底部三个标签「替换文字」「替换底图」「替换二维码」修改内容，最后点击右上角「导出印刷」生成文件。',
        tips: [
          '点击画布上的元素可快速定位到对应的文字输入框',
          '每次修改都会自动暂存草稿，意外退出后可从「个人中心 - 草稿箱」恢复',
        ],
      },
      {
        heading: '2. 画布操作与撤销',
        text: '点击选中元素后可直接拖拽移动，靠近水平 / 垂直中心会自动吸附。二维码、图片与形状类元素选中后，可通过右下角蓝色圆点拖拽缩放尺寸。顶部提供撤销 / 重做（最多 20 步）与「恢复模板初始排版」按钮。',
        tips: [
          '右下角「+ / -」按钮可缩放画布视图，方便查看整体与细节',
          '正面 / 反面切换按钮位于顶栏中间，两面内容相互独立',
        ],
      },
      {
        heading: '3. 保存与导出',
        text: '编辑完成点击「保存」即可存入「我的作品」，随时再次编辑、复制或删除。点击「导出印刷」可选择 PNG / JPG（720P–4K 分辨率）或印刷 PDF（自动附加 3mm 出血与十字裁切线），并支持仅正面、仅反面或正反双面。',
        tips: [
          '社交与微信分享推荐 2K PNG；送给印刷厂请选择 PDF',
          'PNG 格式可勾选透明背景（仅限纯色 / 渐变底的设计）',
        ],
      },
    ],
  },
];

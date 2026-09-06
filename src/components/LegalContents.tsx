import React from 'react';

/**
 * 《隐私政策》全文内容 —— 已适配美序名片（纯前端、数据仅存本地、无服务器）。
 * 开发主体与联系邮箱按需求保留：光年跃迁（温州）科技有限公司 / Jp112022@163.com
 */
export const PrivacyPolicyContent: React.FC = () => (
  <div className="max-w-none">
    <h1 className="text-xl font-bold text-gray-900 text-center mb-2">隐私政策</h1>
    <p className="text-center text-gray-500 mb-6 text-xs">
      <strong>生效日期</strong>：2026年9月6日
    </p>

    <div className="bg-blue-50 p-5 rounded-2xl border-l-4 border-blue-600 mb-6">
      <p className="text-sm text-gray-700 leading-relaxed">
        欢迎使用「美序名片」（以下简称"本应用"）。本应用由
        <strong>光年跃迁（温州）科技有限公司</strong>
        （以下简称"我们"）开发并运营。我们深知个人信息对您的重要性，将严格遵守《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。
      </p>
    </div>

    <p className="mb-6 text-sm text-gray-700 leading-relaxed">
      本隐私政策旨在说明我们如何处理、存储和保护您在使用本应用过程中产生的信息，以及您对这些信息所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，尤其是加粗的条款。如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。
    </p>

    <h2 className="text-base font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2 text-gray-900">
      一、我们收集的信息
    </h2>
    <p className="mb-4 text-sm text-gray-700 leading-relaxed">
      <strong>
        本应用为纯离线应用：不设任何服务器，不具备联网上传能力，我们无法收集、获取您的任何个人信息。
      </strong>
      您在使用本应用过程中产生的以下数据，均仅保存在您当前设备的本地存储空间（LocalStorage 沙箱）中：
    </p>
    <ol className="list-decimal pl-6 mb-6 text-sm text-gray-700 space-y-3">
      <li>
        <strong>名片设计数据</strong>
        ：您主动录入的名片内容（如姓名、职务、电话、邮箱、地址、企业名称等）以及模板选择、排版配置。这些数据是本应用的核心功能内容，仅用于在您的设备上进行渲染显示。
      </li>
      <li>
        <strong>本地上传素材</strong>
        ：您为设计名片而主动上传的底图、二维码图片、头像与 Logo 等文件。这些文件会被压缩后保存在设备本地，仅用于您自己的名片设计。
      </li>
    </ol>

    <h2 className="text-base font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2 text-gray-900">
      二、我们如何使用信息
    </h2>
    <ol className="list-decimal pl-6 mb-6 text-sm text-gray-700 space-y-3">
      <li>
        <strong>提供核心功能</strong>
        ：上述数据仅在您的设备本地被使用，用于名片模板渲染、可视化编辑、草稿暂存与高清图片 / 印刷级 PDF 的本地导出。
      </li>
      <li>
        <strong>不用于分析</strong>
        ：由于本应用不联网、不收集数据，我们不会对您的任何信息进行统计分析、用户画像或自动化决策。
      </li>
    </ol>

    <h2 className="text-base font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2 text-gray-900">
      三、我们如何共享、转让和公开披露信息
    </h2>
    <p className="mb-4 text-sm text-gray-700 leading-relaxed">
      我们郑重承诺：
      <strong>本应用不接入任何第三方 SDK，不包含任何数据统计、广告或埋点组件，不会向任何第三方共享、转让或公开披露您的信息。</strong>
      仅在法律法规规定的、行政或司法机关强制性要求的法定情形下，我们才可能配合提供信息；但因本应用不具备收集与上传能力，我们通常亦无从掌握您的信息。
    </p>

    <h2 className="text-base font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2 text-gray-900">
      四、信息的存储
    </h2>
    <ol className="list-decimal pl-6 mb-6 text-sm text-gray-700 space-y-3">
      <li>
        <strong>存储地点</strong>
        ：您的全部数据均存储于您本人设备的本地存储空间中，不上传云端，不经过任何网络传输。
      </li>
      <li>
        <strong>存储期限</strong>
        ：数据将保留至您主动删除、清除应用数据或卸载本应用为止。您也可以随时在"设置"中使用"清除全部数据"功能一次性彻底删除。
      </li>
    </ol>

    <h2 className="text-base font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2 text-gray-900">
      五、您的权利
    </h2>
    <ol className="list-decimal pl-6 mb-6 text-sm text-gray-700 space-y-3">
      <li>
        <strong>访问权</strong>：您可以随时在本应用中查看您的全部名片作品与草稿。
      </li>
      <li>
        <strong>更正权</strong>：您可以随时在编辑器中修改任意名片内容。
      </li>
      <li>
        <strong>删除权</strong>
        ：您可以删除单个作品、清空草稿箱，或通过"设置 - 清除全部数据"一键彻底删除本应用存储的所有数据。
      </li>
      <li>
        <strong>数据导出</strong>
        ：您可以通过本应用的导出功能，将名片生成 PNG / JPG 高清图片或印刷级 PDF 文件保存到您的设备。
      </li>
    </ol>

    <h2 className="text-base font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2 text-gray-900">
      六、未成年人保护
    </h2>
    <p className="mb-6 text-sm text-gray-700 leading-relaxed">
      我们非常重视对未成年人个人信息的保护。如您是未满 14 周岁的未成年人，请在监护人的指导下使用本应用，并建议不要在名片中录入真实姓名、电话、住址等个人敏感信息。如我们在未事先获得监护人可验证同意的情况下知晓存在相关情形，将立即配合删除相关数据。
    </p>

    <h2 className="text-base font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2 text-gray-900">
      七、本政策的更新
    </h2>
    <p className="mb-6 text-sm text-gray-700 leading-relaxed">
      我们可能会根据法律法规的更新或产品功能的调整，适时对本隐私政策进行修订。修订后的政策将在本应用内显著位置公示，并在生效前通过合理方式通知您。若您在政策修订后继续使用本应用，即表示您同意接受修订后的政策。
    </p>

    <h2 className="text-base font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2 text-gray-900">
      八、联系我们
    </h2>
    <p className="mb-4 text-sm text-gray-700 leading-relaxed">
      如您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式与我们联系：
    </p>
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-6">
      <p className="text-sm text-gray-700">
        <strong>电子邮箱</strong>：Jp112022@163.com
      </p>
    </div>

    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
      <p className="mb-2 text-sm text-gray-500">感谢您使用美序名片！</p>
      <p className="mb-4 text-sm text-gray-500">我们致力于为您提供安全、便捷、有美感与秩序的名片设计服务。</p>
      <p className="text-xs text-gray-400">© 2026 光年跃迁（温州）科技有限公司 版权所有</p>
    </div>
  </div>
);

/**
 * 《用户服务协议》全文内容 —— 已适配美序名片。
 */
export const UserAgreementContent: React.FC = () => (
  <div className="max-w-none">
    <h1 className="text-xl font-bold text-gray-900 text-center mb-2">用户服务协议</h1>
    <p className="text-center text-gray-500 mb-8 text-xs">更新日期：2026年9月6日</p>

    <h2 className="text-base font-semibold mt-8 mb-4 text-gray-900">1. 协议的接受</h2>
    <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
      <p>欢迎使用「美序名片」应用（以下简称"本应用"）。</p>
      <p>
        本协议是您与光年跃迁（温州）科技有限公司（以下简称"我们"）之间关于使用本应用的法律协议。
      </p>
      <p>通过点击"同意并继续"、下载、安装或使用本应用，即表示您已阅读并同意接受本协议的全部条款和条件。</p>
    </div>

    <h2 className="text-base font-semibold mt-8 mb-4 text-gray-900">2. 服务内容</h2>
    <p className="mb-3 text-sm text-gray-700">本应用为您提供以下全部在本地完成的服务：</p>
    <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
      <li>提供多风格名片设计模板，支持按行业与场景浏览、收藏；</li>
      <li>可视化编辑名片内容，包括替换文字、底图、二维码与元素排版；</li>
      <li>本地导出高清 PNG / JPG 图片与印刷级 PDF（含出血与裁切线）；</li>
      <li>在设备本地保存作品、草稿与个人偏好设置。</li>
    </ul>

    <h2 className="text-base font-semibold mt-8 mb-4 text-gray-900">3. 用户义务</h2>
    <p className="mb-3 text-sm text-gray-700">作为本应用的用户，您同意：</p>
    <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
      <li>遵守本协议及所有适用法律法规；</li>
      <li>
        <strong>
          对您录入与上传的名片内容（含文字、企业名称、商标、头像、二维码指向等）的合法性、真实性负责，不得利用本应用制作、传播违反法律法规、侵犯他人商标权、著作权、肖像权、名誉权等合法权益的内容；
        </strong>
      </li>
      <li>不利用本应用从事任何非法活动，或干扰本应用的正常运行；</li>
      <li>保护您的设备安全，防止未授权访问。</li>
    </ul>

    <h2 className="text-base font-semibold mt-8 mb-4 text-gray-900">4. 知识产权</h2>
    <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
      <p>
        本应用本身（包括软件代码、界面设计、内置模板、图形素材等）的所有权利归我们或相应权利人所有，受知识产权法律保护。未经我们书面许可，您不得复制、修改、分发、反向工程或商业使用本应用的任何部分。
      </p>
      <p>
        您使用本应用模板自行设计完成的名片内容之权益归您所有，您应自行对其内容承担相应责任。内置模板仅限您个人或您所在企业的合法名片用途使用，不得单独转售或再分发模板本身。
      </p>
    </div>

    <h2 className="text-base font-semibold mt-8 mb-4 text-gray-900">5. 免责声明</h2>
    <p className="mb-3 text-sm text-gray-700">本应用按"原样"提供，不做任何形式的明示或默示保证。我们特别不保证：</p>
    <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
      <li>本应用将完全符合您的全部要求；</li>
      <li>本应用在所有设备与系统环境中均无中断、及时、安全或无错误地运行；</li>
      <li>
        <strong>
          因您清除设备 / 浏览器数据、卸载应用、设备丢失或损坏等非我方原因导致的本地数据（作品、草稿等）丢失，请您及时通过导出功能自行备份重要设计；
        </strong>
      </li>
      <li>导出成品在第三方印刷服务下的最终印刷效果。</li>
    </ul>

    <h2 className="text-base font-semibold mt-8 mb-4 text-gray-900">6. 协议的终止</h2>
    <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
      <p>如您不同意本协议的任何条款，请停止使用本应用。</p>
      <p>您也可以随时停止使用并删除本应用；我们亦保留在法律允许范围内调整或终止部分服务内容的权利。</p>
    </div>

    <h2 className="text-base font-semibold mt-8 mb-4 text-gray-900">7. 适用法律与争议解决</h2>
    <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
      <p>本协议受中华人民共和国法律管辖。</p>
      <p>
        任何与本协议相关的争议，应首先通过友好协商解决；协商不成的，应提交至温州市有管辖权的人民法院诉讼解决。
      </p>
    </div>

    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
      <p className="text-xs text-gray-400">© 2026 光年跃迁（温州）科技有限公司 版权所有</p>
    </div>
  </div>
);

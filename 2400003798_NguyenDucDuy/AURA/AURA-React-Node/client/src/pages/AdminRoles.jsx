import AccountLayout from '../components/AccountLayout';

const ROLES = [
  {
    name: 'Admin',
    desc: 'Toàn quyền quản trị hệ thống',
    perms: [
      'Quản lý sản phẩm, danh mục, kho',
      'Xem & cập nhật đơn hàng',
      'Quản lý khách hàng / người dùng',
      'Cài đặt hệ thống',
    ],
  },
  {
    name: 'User',
    desc: 'Khách hàng mua sắm trên website',
    perms: [
      'Xem & mua sản phẩm',
      'Quản lý đơn hàng của mình',
      'Danh sách yêu thích',
      'Cập nhật thông tin cá nhân',
    ],
  },
];

export default function AdminRoles() {
  return (
    <AccountLayout adminOnly>
      <div className="account-panel">
        <h2 className="account-panel-title">PHÂN QUYỀN</h2>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
          Vai trò hiện có trong hệ thống AURA.
        </p>
        <div className="admin-role-grid">
          {ROLES.map((r) => (
            <div key={r.name} className="admin-role-card">
              <h3>{r.name}</h3>
              <p className="admin-role-desc">{r.desc}</p>
              <ul>
                {r.perms.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}

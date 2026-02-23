// pages/index.js
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const mahasiswaList = [
  { nim: "2303050104", nama: "LUCKY NUZURUL ARIF MAHENSA" },
  { nim: "2403050003", nama: "NUR AFIFAH" },
  { nim: "2403050006", nama: "ELLA KURNIAWATI" },
  { nim: "2403050009", nama: "SINTA KHOIRUL NISAK" },
  { nim: "2403050012", nama: "RAFLI BAKHTIAR" },
  { nim: "2403050015", nama: "ELVAZA ENGGAL TANAYA" },
  { nim: "2403050018", nama: "SYAHWA ALIANA PUTRI" },
  { nim: "2403050021", nama: "NASYA AYU RINJANI" },
  { nim: "2403050024", nama: "ADELIA DWI BUDI ARTIKA" },
  { nim: "2403050027", nama: "VIOLA PUTRI SABELA" },
  { nim: "2403050030", nama: "ARTHON SENNA" },
  { nim: "2403050033", nama: "NOVELIA MARISKA" },
  { nim: "2403050036", nama: "MEITA RATNA ASIH" },
  { nim: "2403050039", nama: "DIVA OKTAVIANI" },
  { nim: "2403050042", nama: "ALFIAN NUR ILMAN" },
  { nim: "2403050045", nama: "FARIDA RAHMA MARISKA" },
  { nim: "2403050048", nama: "NAZZIL ALFI TSAQIFA" },
  { nim: "2403050051", nama: "MULYA TIANA" },
  { nim: "2403050054", nama: "NATASYA AULIA PRAMESTI" },
  { nim: "2403050057", nama: "SEPTIYA RAKHMAWATI" },
  { nim: "2403050060", nama: "ASMAUL CHOIRIYAH" },
  { nim: "2403050063", nama: "REVI MARISKA" },
  { nim: "2403050066", nama: "NINIS FEBRIANA" },
  { nim: "2403050069", nama: "BILAL AZRIL PRATAMA" },
  { nim: "2403050072", nama: "BAGUS SATRIOAJI" },
  { nim: "2403050075", nama: "DAVID PUTRA MISIYANA" },
  { nim: "2403050078", nama: "ASMI LAMPITA KUSUMA PURBA" },
  { nim: "2403050081", nama: "DIAN PRASETYO BUDI WICAKSONO" },
  { nim: "2403050084", nama: "CINDI LISTINA YANTI" },
  { nim: "2403050087", nama: "IMAN AGUSTIAN" },
  { nim: "2403050090", nama: "SABILA CAHYA PUTRI" },
  { nim: "2403050093", nama: "MUHAMMAD AKMAL TURMUJI" },
  { nim: "2403050096", nama: "VIO SAZZA FITRIANSYAH" },
  { nim: "2403050099", nama: "BILQIS SUROYYA FIRDAUS" },
  { nim: "2403050102", nama: "NAURA IZZA ANNAVIS" },
  { nim: "2403050108", nama: "VELUNA ARNIS" },
  { nim: "2403050111", nama: "FADLI AWALUDIN" },
  { nim: "2403050114", nama: "YULIA DINDA WIHANANTI" },
  { nim: "2403050120", nama: "HELLEN ALFIA KURNIA" },
  { nim: "2403050123", nama: "YESSY FEBRIYANI MEISY PUTRI" },
  { nim: "2403050126", nama: "MUHAMMAD SHOLAHUDDIN MA'RUF" },
  { nim: "2403050129", nama: "SHELLY SAPUTRI" },
  { nim: "2403050135", nama: "KARINA RAMADLANI" },
  { nim: "2403050138", nama: "MILLATI ISLAMIA HANIFA" },
  { nim: "2403050141", nama: "VIRNA ARLINTA SETIAWAN" },
  { nim: "2403050144", nama: "SUCI MUSTIKA AZZAHRA" }
];

export default function Home() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [memberInputs, setMemberInputs] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [addingMember, setAddingMember] = useState({});
  const modalRef = useRef(null);

  // Fetch all groups
  async function fetchGroups() {
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchGroups(); }, []);

  // Tambah kelompok
  async function addGroup() {
    if (!newGroupName.trim()) return alert('Silakan masukkan nama kelompok!');
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newGroupName.trim() }),
    });
    if (res.ok) {
      setNewGroupName('');
      setShowModal(false);
      fetchGroups();
    }
  }

  // Hapus kelompok
  async function deleteGroup(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus kelompok ini?')) return;
    await fetch(`/api/groups/${id}`, { method: 'DELETE' });
    fetchGroups();
  }

  // Tambah anggota
  async function addMember(groupId) {
    const inputVal = memberInputs[groupId] || '';
    if (!inputVal.trim()) return alert('Masukkan nama anggota!');

    // Parse nama dan NIM dari format "NAMA (NIM)"
    const match = inputVal.match(/^(.+?)\s*\((\d+)\)$/);
    const name = match ? match[1].trim() : inputVal.trim();
    const nim = match ? match[2] : null;

    setAddingMember(prev => ({ ...prev, [groupId]: true }));
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_id: groupId, name, nim }),
    });
    if (res.ok) {
      setMemberInputs(prev => ({ ...prev, [groupId]: '' }));
      setSuggestions(prev => ({ ...prev, [groupId]: [] }));
      fetchGroups();
    }
    setAddingMember(prev => ({ ...prev, [groupId]: false }));
  }

  // Hapus anggota
  async function deleteMember(memberId) {
    await fetch(`/api/members/${memberId}`, { method: 'DELETE' });
    fetchGroups();
  }

  // Autocomplete
  function handleMemberInput(groupId, value) {
    setMemberInputs(prev => ({ ...prev, [groupId]: value }));
    if (!value) {
      setSuggestions(prev => ({ ...prev, [groupId]: [] }));
      return;
    }
    const lower = value.toLowerCase();
    const filtered = mahasiswaList.filter(m =>
      m.nama.toLowerCase().includes(lower) || m.nim.includes(lower)
    ).slice(0, 5);
    setSuggestions(prev => ({ ...prev, [groupId]: filtered }));
  }

  function selectSuggestion(groupId, m) {
    setMemberInputs(prev => ({ ...prev, [groupId]: `${m.nama} (${m.nim})` }));
    setSuggestions(prev => ({ ...prev, [groupId]: [] }));
  }

  return (
    <>
      <Head>
        <title>Daftar Kelompok</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </Head>
      <style>{`
        :root {
          --primary: #6366f1;
          --secondary: #ec4899;
          --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; background: var(--bg-gradient); min-height: 100vh; padding: 40px 20px; color: #1f2937; }
        .container { max-width: 800px; margin: 0 auto; }
        header { text-align: center; color: white; margin-bottom: 40px; }
        header h1 { font-size: 2.5rem; margin-bottom: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .btn-add-group { background: white; color: var(--primary); border: none; padding: 12px 24px; border-radius: 30px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: transform 0.2s, box-shadow 0.2s; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; font-size: 1rem; }
        .btn-add-group:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
        #group-list { display: grid; gap: 20px; }
        .group-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transition: transform 0.3s ease; position: relative; overflow: visible; animation: fadeIn 0.5s ease; }
        .group-card:hover { transform: translateY(-5px); }
        .color-strip { position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 16px 16px 0 0; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
        .card-header h3 { font-size: 1.4rem; color: #1f2937; display: flex; align-items: center; gap: 10px; }
        .card-header h3 i { color: var(--primary); }
        .btn-delete-group { background: #fee2e2; color: #ef4444; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; transition: background 0.2s; }
        .btn-delete-group:hover { background: #fecaca; }
        .member-list { list-style: none; margin-bottom: 15px; }
        .member-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: #f3f4f6; border-radius: 8px; margin-bottom: 8px; }
        .member-item:hover { background: #e5e7eb; }
        .member-name { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
        .member-name i { color: #9ca3af; font-size: 0.85rem; }
        .member-nim { font-size: 0.75rem; color: #6b7280; margin-left: 4px; }
        .btn-delete-member { color: #9ca3af; cursor: pointer; transition: color 0.2s; border: none; background: none; }
        .btn-delete-member:hover { color: #ef4444; }
        .input-group { display: flex; gap: 10px; position: relative; }
        .input-group input { flex: 1; padding: 10px 15px; border: 2px solid #e5e7eb; border-radius: 8px; outline: none; transition: border-color 0.2s; font-family: inherit; }
        .input-group input:focus { border-color: var(--primary); }
        .btn-add-member { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: background 0.2s; font-family: inherit; white-space: nowrap; }
        .btn-add-member:hover { background: #4f46e5; }
        .btn-add-member:disabled { opacity: 0.6; cursor: not-allowed; }
        .suggestions-box { background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 999; }
        .suggestion-item { padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #f3f4f6; }
        .suggestion-item:last-child { border-bottom: none; }
        .suggestion-item:hover { background: #f3f4f6; }
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; }
        .modal-overlay.active { display: flex; }
        .modal-content { background: white; padding: 30px; border-radius: 16px; width: 90%; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); animation: slideUp 0.3s ease; }
        .modal-content h2 { margin-bottom: 20px; color: #1f2937; }
        .modal-content input { width: 100%; padding: 12px; margin-bottom: 20px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: inherit; font-size: 1rem; outline: none; }
        .modal-content input:focus { border-color: var(--primary); }
        .modal-buttons { display: flex; justify-content: flex-end; gap: 10px; }
        .btn-cancel { background: #e5e7eb; color: #1f2937; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: inherit; }
        .btn-save { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: inherit; }
        .empty-state { text-align: center; color: white; margin-top: 50px; font-size: 1.2rem; opacity: 0.8; }
        .loading { text-align: center; color: white; margin-top: 50px; font-size: 1.2rem; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="container">
        <header>
          <h1><i className="fas fa-users"></i> Daftar Kelompok</h1>
          <p style={{ marginBottom: '20px' }}>Klik tombol di bawah untuk membuat kelompok baru</p>
          <button className="btn-add-group" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Tambah Kelompok
          </button>
        </header>

        {loading ? (
          <div className="loading"><i className="fas fa-spinner fa-spin"></i> Memuat data...</div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-folder-open fa-3x" style={{ display: 'block', marginBottom: '10px' }}></i>
            <p>Belum ada kelompok. Buat yang pertama!</p>
          </div>
        ) : (
          <div id="group-list">
            {groups.map(group => (
              <div className="group-card" key={group.id}>
                <div className="color-strip"></div>
                <div className="card-header">
                  <h3><i className="fas fa-layer-group"></i> {group.name}</h3>
                  <button className="btn-delete-group" onClick={() => deleteGroup(group.id)} title="Hapus Kelompok">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <ul className="member-list">
                  {(group.members || []).map(member => (
                    <li className="member-item" key={member.id}>
                      <span className="member-name">
                        <i className="fas fa-user"></i>
                        {member.name}
                        {member.nim && <span className="member-nim">({member.nim})</span>}
                      </span>
                      <button className="btn-delete-member" onClick={() => deleteMember(member.id)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </li>
                  ))}
                </ul>
                <div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Ketik Nama atau NIM"
                      value={memberInputs[group.id] || ''}
                      onChange={e => handleMemberInput(group.id, e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addMember(group.id)}
                    />
                    <button
                      className="btn-add-member"
                      onClick={() => addMember(group.id)}
                      disabled={addingMember[group.id]}
                    >
                      <i className="fas fa-plus"></i> Tambah
                    </button>
                  </div>
                  {(suggestions[group.id] || []).length > 0 && (
                    <div className="suggestions-box">
                      {suggestions[group.id].map(m => (
                        <div
                          key={m.nim}
                          className="suggestion-item"
                          onClick={() => selectSuggestion(group.id, m)}
                        >
                          <strong>{m.nama}</strong><br />
                          <small style={{ color: '#6b7280' }}>{m.nim}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <div className={`modal-overlay ${showModal ? 'active' : ''}`} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
        <div className="modal-content">
          <h2>Tambah Kelompok Baru</h2>
          <input
            type="text"
            placeholder="Nama Kelompok (contoh: Tim Marketing)"
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addGroup()}
            autoFocus
          />
          <div className="modal-buttons">
            <button className="btn-cancel" onClick={() => { setShowModal(false); setNewGroupName(''); }}>Batal</button>
            <button className="btn-save" onClick={addGroup}>Simpan</button>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient.js'

export function useTable(table, opts = {}) {
  const { select = '*', orderBy = 'id', ascending = true } = opts
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data: rows, error } = await supabase.from(table).select(select).order(orderBy, { ascending })
    if (error) console.error(`[${table}]`, error.message)
    else setData(rows || [])
    setLoading(false)
  }, [table, select, orderBy, ascending])

  useEffect(() => { refresh() }, [refresh])

  async function insert(row) {
    const { data: rows, error } = await supabase.from(table).insert(row).select()
    if (error) { console.error(`[${table}] insert`, error.message); alert('Gagal menyimpan: ' + error.message); return null }
    await refresh()
    return rows[0]
  }

  async function update(id, patch) {
    const { data: rows, error } = await supabase.from(table).update(patch).eq('id', id).select()
    if (error) { console.error(`[${table}] update`, error.message); alert('Gagal memperbarui: ' + error.message); return null }
    await refresh()
    return rows[0]
  }

  async function remove(id) {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) { console.error(`[${table}] delete`, error.message); alert('Gagal menghapus: ' + error.message); return false }
    await refresh()
    return true
  }

  return { data, loading, refresh, insert, update, remove }
}

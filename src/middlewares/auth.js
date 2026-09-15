/**
 * Controle de acesso da area administrativa (RNF02).
 * Qualquer rota /api/admin/* passa por aqui antes do controlador.
 */
function exigirAdmin(req, res, next) {
  if (req.session && req.session.usuario) return next();
  return res.status(401).json({ erro: 'Sessao expirada ou usuario nao autenticado.' });
}

module.exports = { exigirAdmin };

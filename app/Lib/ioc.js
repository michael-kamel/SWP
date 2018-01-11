module.exports = (function () 
{
    let modulesMeta = {}
    let modules = {}

    function versionDependencies(deps, versionMap)
    {
        util._.keys(versionMap).forEach(depName =>
        {
            let idx = deps.indexOf(depName) 
            deps[idx] = deps[idx] + versionMap[depName]
        })
    }
    function registerModule (modName, constructor, opts = {}) 
    {
        let version = opts.version || ''
        let versionedDependencies = opts.versionedDependencies || {}
        let dependencies = util.reflection.extractDependencies(constructor)
        modName = modName+version
        versionDependencies(dependencies, versionedDependencies)
        modulesMeta[modName] =
        {
            name:modName,
            modName,
            dependencies,
            constructor,
            loading: false,
            loaded: false
        }
    }
    function unregisterModule (modName) 
    {
        delete modulesMeta[modName]
        delete modules[modName]
    }
    function get (modName, dependant) 
    {
        if (modulesMeta[modName]) 
        {
            let modMeta = modulesMeta[modName]
            if (modMeta.loaded) 
            {
                return modules[modName] 
            }
            if (modMeta.loading) 
            {
                throw new Error(`Circular dependency on ${modName} when loading ${dependant}`) 
            }
            modName.loading = true
            let modu = modMeta.constructor.apply(null, util._.map(modMeta.dependencies, name => get(name, modName)))
            modMeta.loaded = true
            modMeta.loading = false
            modules[modName] = modu
            return modu
        }
        throw new Error(`Unregistered module ${modName}`)
    }
    function inject (func, opts = {}) 
    {
        let context = opts.context
        let deps = opts.deps
        let versionedDependencies = opts.versionedDependencies
        let edeps = deps || util.reflection.extractDependencies(func)
        if(versionedDependencies)
            versionDependencies(edeps, versionedDependencies)
        let cDeps = util._.map(edeps, dep => get(dep, 'Anonymous function'))
        return func.bind(context, ...cDeps)
    }
    function construct (modName, opts = {}) 
    {
        let depsMap = opts.depMap || {}
        let context = opts.context
        let version = opts.version || ''
        modName = modName + version
        if (!modulesMeta[modName]) 
        {
            throw new Error(`Unregistered module ${modName}`) 
        }
        let mod = modulesMeta[modName]
        let deps = util._.clone(mod.dependencies).map(dep => depsMap[dep.name] || dep)
        return inject(mod.constructor, {context:context || mod.constructor, deps})()
    }
    function loadAll () 
    {
        util._.forEach(modulesMeta, modMeta => get(modMeta.modName, modMeta.modName))
    }

    return {
        registerModule,
        unregisterModule,
        get,
        inject,
        construct,
        loadAll
    }
}())

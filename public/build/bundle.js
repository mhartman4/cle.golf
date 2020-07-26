var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.21.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Picker.svelte generated by Svelte v3.21.0 */
    const file = "src/Picker.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (15:1) {#each pages as page}
    function create_each_block(ctx) {
    	let span;
    	let t0_value = /*page*/ ctx[3] + "";
    	let t0;
    	let t1;
    	let span_class_value;
    	let span_href_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();

    			attr_dev(span, "class", span_class_value = "picker-option " + (/*activePage*/ ctx[0] === /*page*/ ctx[3]
    			? "selected"
    			: "") + " svelte-1w8kw7b");

    			attr_dev(span, "href", span_href_value = "#" + /*page*/ ctx[3]);
    			add_location(span, file, 15, 2, 295);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			if (remount) dispose();

    			dispose = listen_dev(
    				span,
    				"click",
    				function () {
    					if (is_function(/*handleClick*/ ctx[2](/*page*/ ctx[3]))) /*handleClick*/ ctx[2](/*page*/ ctx[3]).apply(this, arguments);
    				},
    				false,
    				false,
    				false
    			);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*pages*/ 2 && t0_value !== (t0_value = /*page*/ ctx[3] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*activePage, pages*/ 3 && span_class_value !== (span_class_value = "picker-option " + (/*activePage*/ ctx[0] === /*page*/ ctx[3]
    			? "selected"
    			: "") + " svelte-1w8kw7b")) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (dirty & /*pages*/ 2 && span_href_value !== (span_href_value = "#" + /*page*/ ctx[3])) {
    				attr_dev(span, "href", span_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:1) {#each pages as page}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let each_value = /*pages*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "picker svelte-1w8kw7b");
    			add_location(div, file, 13, 0, 249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activePage, pages, handleClick*/ 7) {
    				each_value = /*pages*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { pages = [] } = $$props;
    	let { activePage } = $$props;

    	onMount(() => {
    		// Set default tab value
    		$$invalidate(0, activePage = pages[0]);
    	});

    	const handleClick = tabValue => () => $$invalidate(0, activePage = tabValue);
    	const writable_props = ["pages", "activePage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Picker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Picker", $$slots, []);

    	$$self.$set = $$props => {
    		if ("pages" in $$props) $$invalidate(1, pages = $$props.pages);
    		if ("activePage" in $$props) $$invalidate(0, activePage = $$props.activePage);
    	};

    	$$self.$capture_state = () => ({ onMount, pages, activePage, handleClick });

    	$$self.$inject_state = $$props => {
    		if ("pages" in $$props) $$invalidate(1, pages = $$props.pages);
    		if ("activePage" in $$props) $$invalidate(0, activePage = $$props.activePage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activePage, pages, handleClick];
    }

    class Picker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { pages: 1, activePage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Picker",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*activePage*/ ctx[0] === undefined && !("activePage" in props)) {
    			console.warn("<Picker> was created without expected prop 'activePage'");
    		}
    	}

    	get pages() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pages(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activePage() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activePage(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src/Roster.svelte generated by Svelte v3.21.0 */
    const file$1 = "src/Roster.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (19:3) {#each roster as player}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*player*/ ctx[2].name + "";
    	let t0;
    	let t1;
    	let td1;

    	let t2_value = (/*player*/ ctx[2].position
    	? numeral(/*player*/ ctx[2].projMoney).format("$0,0")
    	: "") + "";

    	let t2;
    	let t3;
    	let td2;

    	let t4_value = (/*player*/ ctx[2].isPlaying
    	? /*player*/ ctx[2].position
    		? /*player*/ ctx[2].position
    		: /*player*/ ctx[2].pgaStatus === "wd" ? "WD" : "CUT"
    	: "") + "";

    	let t4;
    	let t5;
    	let td3;

    	let t6_value = (/*player*/ ctx[2].position
    	? /*player*/ ctx[2].total ? /*player*/ ctx[2].total : "E"
    	: "") + "";

    	let t6;
    	let t7;
    	let td4;

    	let t8_value = (/*player*/ ctx[2].today != undefined
    	? /*player*/ ctx[2].today == 0
    		? "E"
    		: /*player*/ ctx[2].today
    	: "") + "";

    	let t8;
    	let t9;
    	let td5;
    	let t10_value = (/*player*/ ctx[2].thru ? /*player*/ ctx[2].thru : "") + "";
    	let t10;
    	let tr_class_value;
    	let t11;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			attr_dev(td0, "class", "svelte-fsu2qu");
    			add_location(td0, file$1, 21, 6, 681);
    			attr_dev(td1, "class", "svelte-fsu2qu");
    			add_location(td1, file$1, 22, 21, 725);
    			attr_dev(td2, "class", "svelte-fsu2qu");
    			add_location(td2, file$1, 23, 21, 821);
    			attr_dev(td3, "class", "svelte-fsu2qu");
    			add_location(td3, file$1, 24, 21, 958);
    			attr_dev(td4, "class", "svelte-fsu2qu");
    			add_location(td4, file$1, 25, 21, 1049);
    			attr_dev(td5, "class", "svelte-fsu2qu");
    			add_location(td5, file$1, 26, 21, 1155);
    			attr_dev(tr, "class", tr_class_value = "player-row" + (/*player*/ ctx[2].isPlaying ? "" : " inactive") + (/*player*/ ctx[2].position ? "" : " cut") + " svelte-fsu2qu");
    			add_location(tr, file$1, 20, 5, 583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			insert_dev(target, t11, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*roster*/ 1 && t0_value !== (t0_value = /*player*/ ctx[2].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*roster*/ 1 && t2_value !== (t2_value = (/*player*/ ctx[2].position
    			? numeral(/*player*/ ctx[2].projMoney).format("$0,0")
    			: "") + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*roster*/ 1 && t4_value !== (t4_value = (/*player*/ ctx[2].isPlaying
    			? /*player*/ ctx[2].position
    				? /*player*/ ctx[2].position
    				: /*player*/ ctx[2].pgaStatus === "wd" ? "WD" : "CUT"
    			: "") + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*roster*/ 1 && t6_value !== (t6_value = (/*player*/ ctx[2].position
    			? /*player*/ ctx[2].total ? /*player*/ ctx[2].total : "E"
    			: "") + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*roster*/ 1 && t8_value !== (t8_value = (/*player*/ ctx[2].today != undefined
    			? /*player*/ ctx[2].today == 0
    				? "E"
    				: /*player*/ ctx[2].today
    			: "") + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*roster*/ 1 && t10_value !== (t10_value = (/*player*/ ctx[2].thru ? /*player*/ ctx[2].thru : "") + "")) set_data_dev(t10, t10_value);

    			if (dirty & /*roster*/ 1 && tr_class_value !== (tr_class_value = "player-row" + (/*player*/ ctx[2].isPlaying ? "" : " inactive") + (/*player*/ ctx[2].position ? "" : " cut") + " svelte-fsu2qu")) {
    				attr_dev(tr, "class", tr_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (detaching) detach_dev(t11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(19:3) {#each roster as player}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let div_transition;
    	let current;
    	let each_value = /*roster*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Golfer";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Proj. $";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Pos";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Total";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Today";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Thru";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th0, "class", "roster-header svelte-fsu2qu");
    			add_location(th0, file$1, 9, 4, 182);
    			attr_dev(th1, "class", "roster-header svelte-fsu2qu");
    			add_location(th1, file$1, 10, 16, 236);
    			attr_dev(th2, "class", "roster-header svelte-fsu2qu");
    			add_location(th2, file$1, 11, 16, 291);
    			attr_dev(th3, "class", "roster-header svelte-fsu2qu");
    			add_location(th3, file$1, 12, 16, 342);
    			attr_dev(th4, "class", "roster-header svelte-fsu2qu");
    			add_location(th4, file$1, 13, 16, 395);
    			attr_dev(th5, "class", "roster-header svelte-fsu2qu");
    			add_location(th5, file$1, 14, 16, 448);
    			add_location(tr, file$1, 8, 3, 173);
    			add_location(thead, file$1, 7, 2, 162);
    			add_location(tbody, file$1, 17, 2, 506);
    			attr_dev(table, "class", "roster-table svelte-fsu2qu");
    			add_location(table, file$1, 6, 1, 131);
    			attr_dev(div, "class", "roster svelte-fsu2qu");
    			add_location(div, file$1, 5, 0, 92);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*roster, undefined, numeral*/ 1) {
    				each_value = /*roster*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { roster } = $$props, { teamName } = $$props;
    	const writable_props = ["roster", "teamName"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Roster> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Roster", $$slots, []);

    	$$self.$set = $$props => {
    		if ("roster" in $$props) $$invalidate(0, roster = $$props.roster);
    		if ("teamName" in $$props) $$invalidate(1, teamName = $$props.teamName);
    	};

    	$$self.$capture_state = () => ({ slide, roster, teamName });

    	$$self.$inject_state = $$props => {
    		if ("roster" in $$props) $$invalidate(0, roster = $$props.roster);
    		if ("teamName" in $$props) $$invalidate(1, teamName = $$props.teamName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [roster, teamName];
    }

    class Roster extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { roster: 0, teamName: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Roster",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*roster*/ ctx[0] === undefined && !("roster" in props)) {
    			console.warn("<Roster> was created without expected prop 'roster'");
    		}

    		if (/*teamName*/ ctx[1] === undefined && !("teamName" in props)) {
    			console.warn("<Roster> was created without expected prop 'teamName'");
    		}
    	}

    	get roster() {
    		throw new Error("<Roster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set roster(value) {
    		throw new Error("<Roster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get teamName() {
    		throw new Error("<Roster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set teamName(value) {
    		throw new Error("<Roster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Team.svelte generated by Svelte v3.21.0 */
    const file$2 = "src/Team.svelte";

    // (48:1) {#if rosterVisible}
    function create_if_block(ctx) {
    	let current;

    	const roster = new Roster({
    			props: {
    				roster: /*team*/ ctx[0].roster,
    				teamName: /*teamName*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(roster.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(roster, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const roster_changes = {};
    			if (dirty & /*team*/ 1) roster_changes.roster = /*team*/ ctx[0].roster;
    			roster.$set(roster_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(roster.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(roster.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(roster, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(48:1) {#if rosterVisible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div2;
    	let div1;
    	let table;
    	let tbody;
    	let tr;
    	let td0;
    	let t0;
    	let t1;
    	let td1;
    	let img;
    	let img_src_value;
    	let t2;
    	let td2;
    	let t3;
    	let t4;
    	let div0;
    	let t5;
    	let div0_class_value;
    	let td2_class_value;
    	let t6;
    	let td3;
    	let t7_value = numeral(/*team*/ ctx[0].totalMoney).format("$0,0") + "";
    	let t7;
    	let br;
    	let td3_class_value;
    	let t8;
    	let current;
    	let dispose;
    	let if_block = /*rosterVisible*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			table = element("table");
    			tbody = element("tbody");
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(/*placeNumber*/ ctx[1]);
    			t1 = space();
    			td1 = element("td");
    			img = element("img");
    			t2 = space();
    			td2 = element("td");
    			t3 = text(/*teamNameNoOwner*/ ctx[5]);
    			t4 = space();
    			div0 = element("div");
    			t5 = text(/*owner*/ ctx[6]);
    			t6 = space();
    			td3 = element("td");
    			t7 = text(t7_value);
    			br = element("br");
    			t8 = space();
    			if (if_block) if_block.c();
    			attr_dev(td0, "class", "standings-place-number svelte-1h06keg");
    			attr_dev(td0, "width", "15");
    			add_location(td0, file$2, 32, 5, 941);
    			attr_dev(img, "class", "player-photo svelte-1h06keg");
    			if (img.src !== (img_src_value = /*pictureUrl*/ ctx[7])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "45");
    			attr_dev(img, "height", "45");
    			add_location(img, file$2, 34, 6, 1033);
    			attr_dev(td1, "width", "55");
    			add_location(td1, file$2, 33, 5, 1011);
    			attr_dev(div0, "class", div0_class_value = "owner " + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-1h06keg");
    			add_location(div0, file$2, 38, 6, 1203);
    			attr_dev(td2, "class", td2_class_value = "team-name " + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-1h06keg");
    			add_location(td2, file$2, 36, 5, 1118);
    			add_location(br, file$2, 41, 47, 1390);
    			attr_dev(td3, "class", td3_class_value = "team-earnings " + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-1h06keg");
    			add_location(td3, file$2, 40, 5, 1284);
    			add_location(tr, file$2, 31, 4, 931);
    			add_location(tbody, file$2, 30, 3, 919);
    			attr_dev(table, "border", "0");
    			attr_dev(table, "width", "100%");
    			add_location(table, file$2, 29, 2, 884);
    			attr_dev(div1, "class", "header svelte-1h06keg");
    			add_location(div1, file$2, 28, 1, 837);
    			attr_dev(div2, "class", "team");
    			add_location(div2, file$2, 27, 0, 817);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, tbody);
    			append_dev(tbody, tr);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, img);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(td2, t4);
    			append_dev(td2, div0);
    			append_dev(div0, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td3);
    			append_dev(td3, t7);
    			append_dev(td3, br);
    			append_dev(div2, t8);
    			if (if_block) if_block.m(div2, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(div1, "click", /*toggleRoster*/ ctx[8], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*placeNumber*/ 2) set_data_dev(t0, /*placeNumber*/ ctx[1]);

    			if (!current || dirty & /*isFavorite*/ 4 && div0_class_value !== (div0_class_value = "owner " + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-1h06keg")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*isFavorite*/ 4 && td2_class_value !== (td2_class_value = "team-name " + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-1h06keg")) {
    				attr_dev(td2, "class", td2_class_value);
    			}

    			if ((!current || dirty & /*team*/ 1) && t7_value !== (t7_value = numeral(/*team*/ ctx[0].totalMoney).format("$0,0") + "")) set_data_dev(t7, t7_value);

    			if (!current || dirty & /*isFavorite*/ 4 && td3_class_value !== (td3_class_value = "team-earnings " + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-1h06keg")) {
    				attr_dev(td3, "class", td3_class_value);
    			}

    			if (/*rosterVisible*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*rosterVisible*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { team } = $$props, { placeNumber } = $$props, { isFavorite } = $$props;
    	let id = team.id.$t.replace("https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/2/public/full/", "");
    	let teamName = team.gsx$team.$t;
    	let teamNameNoOwner = team.gsx$teamname.$t;
    	let owner = team.gsx$owner.$t;
    	let pictureUrl = "https://pga-tour-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,g_face:center,h_45,q_auto,t_headshots_leaderboard_l,w_45/headshots_" + team.roster[0].id + ".png";
    	let rosterVisible = false;

    	function toggleRoster() {
    		$$invalidate(3, rosterVisible = !rosterVisible);

    		if (rosterVisible) {
    			ga("send", {
    				hitType: "event",
    				eventCategory: "Weekly",
    				eventAction: "Click Team",
    				eventLabel: teamName
    			});
    		}
    	}

    	const writable_props = ["team", "placeNumber", "isFavorite"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Team> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Team", $$slots, []);

    	$$self.$set = $$props => {
    		if ("team" in $$props) $$invalidate(0, team = $$props.team);
    		if ("placeNumber" in $$props) $$invalidate(1, placeNumber = $$props.placeNumber);
    		if ("isFavorite" in $$props) $$invalidate(2, isFavorite = $$props.isFavorite);
    	};

    	$$self.$capture_state = () => ({
    		Roster,
    		team,
    		placeNumber,
    		isFavorite,
    		id,
    		teamName,
    		teamNameNoOwner,
    		owner,
    		pictureUrl,
    		rosterVisible,
    		toggleRoster
    	});

    	$$self.$inject_state = $$props => {
    		if ("team" in $$props) $$invalidate(0, team = $$props.team);
    		if ("placeNumber" in $$props) $$invalidate(1, placeNumber = $$props.placeNumber);
    		if ("isFavorite" in $$props) $$invalidate(2, isFavorite = $$props.isFavorite);
    		if ("id" in $$props) id = $$props.id;
    		if ("teamName" in $$props) $$invalidate(4, teamName = $$props.teamName);
    		if ("teamNameNoOwner" in $$props) $$invalidate(5, teamNameNoOwner = $$props.teamNameNoOwner);
    		if ("owner" in $$props) $$invalidate(6, owner = $$props.owner);
    		if ("pictureUrl" in $$props) $$invalidate(7, pictureUrl = $$props.pictureUrl);
    		if ("rosterVisible" in $$props) $$invalidate(3, rosterVisible = $$props.rosterVisible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		team,
    		placeNumber,
    		isFavorite,
    		rosterVisible,
    		teamName,
    		teamNameNoOwner,
    		owner,
    		pictureUrl,
    		toggleRoster
    	];
    }

    class Team extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { team: 0, placeNumber: 1, isFavorite: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Team",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*team*/ ctx[0] === undefined && !("team" in props)) {
    			console.warn("<Team> was created without expected prop 'team'");
    		}

    		if (/*placeNumber*/ ctx[1] === undefined && !("placeNumber" in props)) {
    			console.warn("<Team> was created without expected prop 'placeNumber'");
    		}

    		if (/*isFavorite*/ ctx[2] === undefined && !("isFavorite" in props)) {
    			console.warn("<Team> was created without expected prop 'isFavorite'");
    		}
    	}

    	get team() {
    		throw new Error("<Team>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set team(value) {
    		throw new Error("<Team>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeNumber() {
    		throw new Error("<Team>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeNumber(value) {
    		throw new Error("<Team>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFavorite() {
    		throw new Error("<Team>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFavorite(value) {
    		throw new Error("<Team>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Leaderboard.svelte generated by Svelte v3.21.0 */

    const file$3 = "src/Leaderboard.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (8:3) {#if i < 10}
    function create_if_block$1(ctx) {
    	let td;
    	let img;
    	let img_src_value;
    	let t0;
    	let div;
    	let t1_value = /*player*/ ctx[1].current_position + "";
    	let t1;
    	let br;
    	let t2_value = /*player*/ ctx[1].player_bio.last_name + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			td = element("td");
    			img = element("img");
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			br = element("br");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(img, "width", "60");
    			if (img.src !== (img_src_value = "https://pga-tour-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,g_face:center,h_45,q_auto,t_headshots_leaderboard_l,w_45/headshots_" + /*player*/ ctx[1].player_id + ".png")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$3, 9, 5, 175);
    			add_location(br, file$3, 10, 49, 408);
    			attr_dev(div, "class", "badge svelte-xxltsf");
    			add_location(div, file$3, 10, 5, 364);
    			attr_dev(td, "align", "center");
    			add_location(td, file$3, 8, 4, 150);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, img);
    			append_dev(td, t0);
    			append_dev(td, div);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			append_dev(td, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*leaderboard*/ 1 && img.src !== (img_src_value = "https://pga-tour-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,g_face:center,h_45,q_auto,t_headshots_leaderboard_l,w_45/headshots_" + /*player*/ ctx[1].player_id + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*leaderboard*/ 1 && t1_value !== (t1_value = /*player*/ ctx[1].current_position + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*leaderboard*/ 1 && t2_value !== (t2_value = /*player*/ ctx[1].player_bio.last_name + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(8:3) {#if i < 10}",
    		ctx
    	});

    	return block;
    }

    // (7:2) {#each leaderboard as player, i}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[3] < 10 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[3] < 10) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(7:2) {#each leaderboard as player, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let table;
    	let tr;
    	let each_value = /*leaderboard*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$3, 5, 2, 90);
    			attr_dev(table, "align", "center");
    			add_location(table, file$3, 4, 1, 65);
    			attr_dev(div, "align", "center");
    			add_location(div, file$3, 3, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*leaderboard*/ 1) {
    				each_value = /*leaderboard*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { leaderboard } = $$props;
    	const writable_props = ["leaderboard"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Leaderboard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Leaderboard", $$slots, []);

    	$$self.$set = $$props => {
    		if ("leaderboard" in $$props) $$invalidate(0, leaderboard = $$props.leaderboard);
    	};

    	$$self.$capture_state = () => ({ leaderboard });

    	$$self.$inject_state = $$props => {
    		if ("leaderboard" in $$props) $$invalidate(0, leaderboard = $$props.leaderboard);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [leaderboard];
    }

    class Leaderboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { leaderboard: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Leaderboard",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*leaderboard*/ ctx[0] === undefined && !("leaderboard" in props)) {
    			console.warn("<Leaderboard> was created without expected prop 'leaderboard'");
    		}
    	}

    	get leaderboard() {
    		throw new Error("<Leaderboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leaderboard(value) {
    		throw new Error("<Leaderboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Weekly.svelte generated by Svelte v3.21.0 */

    const { console: console_1 } = globals;
    const file$4 = "src/Weekly.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (132:0) {:else}
    function create_else_block_2(ctx) {
    	let img;
    	let img_src_value;
    	let span;

    	const block = {
    		c: function create() {
    			img = element("img");
    			span = element("span");
    			span.textContent = " Loading current tournament";
    			attr_dev(img, "class", "sheets-icon");
    			if (img.src !== (img_src_value = "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$4, 132, 1, 4804);
    			add_location(span, file$4, 132, 113, 4916);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(132:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (130:0) {#if tourneyName}
    function create_if_block_2(ctx) {
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*tourneyName*/ ctx[1]);
    			attr_dev(h1, "class", "tourney-name svelte-1c5y5sb");
    			add_location(h1, file$4, 130, 1, 4751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tourneyName*/ 2) set_data_dev(t, /*tourneyName*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(130:0) {#if tourneyName}",
    		ctx
    	});

    	return block;
    }

    // (161:1) {:else}
    function create_else_block_1(ctx) {
    	let img;
    	let img_src_value;
    	let span;

    	const block = {
    		c: function create() {
    			img = element("img");
    			span = element("span");
    			span.textContent = " Loading teams and standings";
    			attr_dev(img, "class", "sheets-icon");
    			if (img.src !== (img_src_value = "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$4, 161, 2, 5670);
    			add_location(span, file$4, 161, 114, 5782);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(161:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (142:1) {#if teams}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*teams*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*teams, favoriteTeam, setFavorite*/ 13) {
    				each_value = /*teams*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(142:1) {#if teams}",
    		ctx
    	});

    	return block;
    }

    // (150:6) {:else}
    function create_else_block(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "♡";
    			set_style(span, "font-size", "13px");
    			set_style(span, "color", "#969494");
    			add_location(span, file$4, 150, 7, 5413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(150:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (148:6) {#if favoriteTeam === team.gsx$team.$t}
    function create_if_block_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "❤️";
    			set_style(span, "font-size", "10px");
    			add_location(span, file$4, 148, 7, 5351);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(148:6) {#if favoriteTeam === team.gsx$team.$t}",
    		ctx
    	});

    	return block;
    }

    // (143:2) {#each teams as team, i}
    function create_each_block$3(ctx) {
    	let table;
    	let tr;
    	let td0;
    	let span;
    	let t0;
    	let td1;
    	let t1;
    	let current;
    	let dispose;

    	function select_block_type_2(ctx, dirty) {
    		if (/*favoriteTeam*/ ctx[2] === /*team*/ ctx[10].gsx$team.$t) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const team = new Team({
    			props: {
    				team: /*team*/ ctx[10],
    				placeNumber: /*i*/ ctx[12] + 1,
    				isFavorite: /*favoriteTeam*/ ctx[2] === /*team*/ ctx[10].gsx$team.$t
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");
    			td0 = element("td");
    			span = element("span");
    			if_block.c();
    			t0 = space();
    			td1 = element("td");
    			create_component(team.$$.fragment);
    			t1 = space();
    			attr_dev(span, "class", "favorite-button");
    			add_location(span, file$4, 146, 6, 5226);
    			attr_dev(td0, "class", "favorite-cell svelte-1c5y5sb");
    			attr_dev(td0, "width", "30");
    			add_location(td0, file$4, 145, 5, 5182);
    			add_location(td1, file$4, 154, 5, 5511);
    			add_location(tr, file$4, 144, 4, 5172);
    			attr_dev(table, "class", "team svelte-1c5y5sb");
    			attr_dev(table, "width", "100%");
    			attr_dev(table, "border", "0");
    			add_location(table, file$4, 143, 3, 5123);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, td0);
    			append_dev(td0, span);
    			if_block.m(span, null);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			mount_component(team, td1, null);
    			append_dev(table, t1);
    			current = true;
    			if (remount) dispose();

    			dispose = listen_dev(
    				span,
    				"click",
    				function () {
    					if (is_function(/*setFavorite*/ ctx[3](/*team*/ ctx[10].gsx$team.$t))) /*setFavorite*/ ctx[3](/*team*/ ctx[10].gsx$team.$t).apply(this, arguments);
    				},
    				false,
    				false,
    				false
    			);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type !== (current_block_type = select_block_type_2(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}

    			const team_changes = {};
    			if (dirty & /*teams*/ 1) team_changes.team = /*team*/ ctx[10];
    			if (dirty & /*favoriteTeam, teams*/ 5) team_changes.isFavorite = /*favoriteTeam*/ ctx[2] === /*team*/ ctx[10].gsx$team.$t;
    			team.$set(team_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(team.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(team.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if_block.d();
    			destroy_component(team);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(143:2) {#each teams as team, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t;
    	let div;
    	let current_block_type_index;
    	let if_block1;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*tourneyName*/ ctx[1]) return create_if_block_2;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	const if_block_creators = [create_if_block$2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*teams*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block0.c();
    			t = space();
    			div = element("div");
    			if_block1.c();
    			attr_dev(div, "class", "teams");
    			add_location(div, file$4, 140, 0, 5060);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let teams, tourneyName, leaderboard, favoriteTeam;

    	// onMount do all of our async functions
    	onMount(async () => {
    		if (document.cookie.split("; ").find(row => row.startsWith("favoriteTeam"))) {
    			$$invalidate(2, favoriteTeam = document.cookie.split("; ").find(row => row.startsWith("favoriteTeam")).split("=")[1]);
    		} else {
    			$$invalidate(2, favoriteTeam = "");
    		}

    		console.log(favoriteTeam);
    		const tourneyId = await getRelevantTournament();
    		const pgaStanding = await getPgaStandings(tourneyId);
    		const rawTeams = await getTeamRosters();
    		processTeams(rawTeams, pgaStanding);
    	});

    	function setFavorite(message) {
    		document.cookie = "favoriteTeam=" + message;
    		$$invalidate(2, favoriteTeam = message);

    		ga("send", {
    			hitType: "event",
    			eventCategory: "Weekly",
    			eventAction: "Favorite",
    			eventLabel: teamName
    		});
    	}

    	const processTeams = (rawTeams, pgaStanding) => {
    		rawTeams.forEach(team => {
    			team.processed = true;
    			team.roster = [];
    			team.totalMoney = 0;

    			if (team.gsx$roster.$t != undefined) {
    				JSON.parse(team.gsx$roster.$t).forEach(player => {
    					const pgaPlayerMatches = pgaStanding.filter(p => p.player_id === player.id);

    					if (pgaPlayerMatches.length > 0) {
    						player.isPlaying = true;
    						const pgaPlayer = pgaPlayerMatches[0];
    						(player.name = pgaPlayer.player_bio.first_name + " " + pgaPlayer.player_bio.last_name, player.positionNum = parseInt(pgaPlayer.current_position.replace(/\D/g, "")), player.position = pgaPlayer.current_position, player.projMoney = pgaPlayer.rankings.projected_money_event, player.today = pgaPlayer.today, player.thru = pgaPlayer.thru, player.total = pgaPlayer.total, player.playerId = pgaPlayer.player_id, player.pgaStatus = pgaPlayer.status, team.totalMoney += pgaPlayer.rankings.projected_money_event);
    					}

    					team.roster.push(player);
    				});
    			}
    		});

    		rawTeams.forEach(team => {
    			team.roster.forEach(player => {
    				if (player.isPlaying === undefined) {
    					player.isPlaying = false;

    					// If not playing put at bottom of list
    					player.sort = -2;
    				} else {
    					if (isNaN(player.positionNum)) {
    						// Next up is cut players
    						player.sort = -1;
    					} else {
    						// Then sort by projected money
    						player.sort = parseInt(player.projMoney);
    					}
    				}
    			}); // console.log(player)
    		});

    		const sortedTeams = rawTeams.sort((a, b) => {
    			return a.totalMoney > b.totalMoney
    			? -1
    			: a.totalMoney < b.totalMoney ? 1 : 0;
    		});

    		sortedTeams.forEach(team => {
    			const sortedRoster = team.roster.sort((a, b) => a.sort < b.sort ? 1 : -1);
    			team.roster = sortedRoster;
    		});

    		$$invalidate(0, teams = sortedTeams);
    	};

    	// Hit the google sheet for the schedule
    	const getRelevantTournament = async () => {
    		// const response = await fetch(`https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/1/public/full?alt=json`)
    		const response = await fetch(`https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/schedule?timestamp=` + Date.now());

    		const data = await response.json();
    		const today = new Date();
    		const tourneysBeforeToday = data.feed.entry.filter(event => new Date(Date.parse(event.gsx$date.$t)) <= today.setHours(0, 0, 0, 0));
    		const tourneyId = tourneysBeforeToday.slice(-1)[0].gsx$tournamentid.$t;
    		$$invalidate(1, tourneyName = tourneysBeforeToday.slice(-1)[0].gsx$name.$t);
    		return tourneyId;
    	};

    	const getPgaStandings = async tourneyId => {
    		// Hit KVDB to get our security blurb so we can call the PGA method
    		const response = await fetch(`https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/pgasecurityblurb?timestamp="` + Date.now());

    		const securityBlurb = await response.text();
    		console.log(securityBlurb);

    		// This is where we hit the PGA
    		return makePgaCall(securityBlurb, tourneyId);
    	};

    	const makePgaCall = async (securityBlurb, tourneyId) => {
    		console.log(securityBlurb);
    		const pgaResp = await fetch("https://statdata.pgatour.com/r/" + tourneyId + "/2020/leaderboard-v2.json" + securityBlurb + "&timestamp=" + Date.now());
    		const jsonResp = await pgaResp.json();
    		leaderboard = await jsonResp.leaderboard.players;
    		return jsonResp.leaderboard.players;
    	};

    	// This one gets our team rosters from the Google Sheet
    	const getTeamRosters = async () => {
    		// const response = await fetch(`https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/2/public/full?alt=json`)
    		const response = await fetch(`https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/rosters`);

    		const data = await response.json();
    		return await data.feed.entry.filter(e => e.gsx$roster.$t);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Weekly> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Weekly", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		Team,
    		Leaderboard,
    		teams,
    		tourneyName,
    		leaderboard,
    		favoriteTeam,
    		setFavorite,
    		processTeams,
    		getRelevantTournament,
    		getPgaStandings,
    		makePgaCall,
    		getTeamRosters
    	});

    	$$self.$inject_state = $$props => {
    		if ("teams" in $$props) $$invalidate(0, teams = $$props.teams);
    		if ("tourneyName" in $$props) $$invalidate(1, tourneyName = $$props.tourneyName);
    		if ("leaderboard" in $$props) leaderboard = $$props.leaderboard;
    		if ("favoriteTeam" in $$props) $$invalidate(2, favoriteTeam = $$props.favoriteTeam);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [teams, tourneyName, favoriteTeam, setFavorite];
    }

    class Weekly extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Weekly",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/OverallRoster.svelte generated by Svelte v3.21.0 */
    const file$5 = "src/OverallRoster.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (41:3) {#each roster as player}
    function create_each_block$4(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*player*/ ctx[1].gsx$player.$t + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = numeral(/*player*/ ctx[1].gsx$earnings.$t).format("$0,0") + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(td0, "class", "svelte-guy1rs");
    			add_location(td0, file$5, 42, 5, 775);
    			attr_dev(td1, "class", "svelte-guy1rs");
    			add_location(td1, file$5, 43, 5, 812);
    			attr_dev(tr, "class", "player-row svelte-guy1rs");
    			add_location(tr, file$5, 41, 4, 746);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*roster*/ 1 && t0_value !== (t0_value = /*player*/ ctx[1].gsx$player.$t + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*roster*/ 1 && t2_value !== (t2_value = numeral(/*player*/ ctx[1].gsx$earnings.$t).format("$0,0") + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(41:3) {#each roster as player}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let tbody;
    	let div_transition;
    	let current;
    	let each_value = /*roster*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Golfer";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Earnings";
    			t3 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th0, "class", "roster-header svelte-guy1rs");
    			add_location(th0, file$5, 35, 4, 590);
    			attr_dev(th1, "class", "roster-header svelte-guy1rs");
    			add_location(th1, file$5, 36, 16, 644);
    			add_location(tr, file$5, 34, 3, 581);
    			add_location(thead, file$5, 33, 2, 570);
    			add_location(tbody, file$5, 39, 2, 706);
    			attr_dev(table, "class", "roster-table svelte-guy1rs");
    			add_location(table, file$5, 32, 1, 539);
    			attr_dev(div, "class", "roster svelte-guy1rs");
    			add_location(div, file$5, 31, 0, 500);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(table, t3);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*numeral, roster*/ 1) {
    				each_value = /*roster*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { roster } = $$props;
    	const writable_props = ["roster"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<OverallRoster> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("OverallRoster", $$slots, []);

    	$$self.$set = $$props => {
    		if ("roster" in $$props) $$invalidate(0, roster = $$props.roster);
    	};

    	$$self.$capture_state = () => ({ slide, roster });

    	$$self.$inject_state = $$props => {
    		if ("roster" in $$props) $$invalidate(0, roster = $$props.roster);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [roster];
    }

    class OverallRoster extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { roster: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverallRoster",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*roster*/ ctx[0] === undefined && !("roster" in props)) {
    			console.warn("<OverallRoster> was created without expected prop 'roster'");
    		}
    	}

    	get roster() {
    		throw new Error("<OverallRoster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set roster(value) {
    		throw new Error("<OverallRoster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/OverallTeam.svelte generated by Svelte v3.21.0 */
    const file$6 = "src/OverallTeam.svelte";

    // (45:2) {#if rosterVisible}
    function create_if_block$3(ctx) {
    	let current;

    	const overallroster = new OverallRoster({
    			props: { roster: /*team*/ ctx[0].roster },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overallroster.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overallroster, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const overallroster_changes = {};
    			if (dirty & /*team*/ 1) overallroster_changes.roster = /*team*/ ctx[0].roster;
    			overallroster.$set(overallroster_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overallroster.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overallroster.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overallroster, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(45:2) {#if rosterVisible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let table;
    	let tbody;
    	let tr;
    	let td0;
    	let t0;
    	let t1;
    	let td1;
    	let span;
    	let t2_value = numeral(/*teamTotalPayout*/ ctx[7]).format("$0") + "";
    	let t2;
    	let span_class_value;
    	let t3;
    	let td2;
    	let t4;
    	let t5;
    	let div0;
    	let t6;
    	let div0_class_value;
    	let td2_class_value;
    	let t7;
    	let td3;
    	let t8_value = numeral(/*teamTotalEarnings*/ ctx[6]).format("$0,0") + "";
    	let t8;
    	let br;
    	let td3_class_value;
    	let t9;
    	let current;
    	let dispose;
    	let if_block = /*rosterVisible*/ ctx[3] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			table = element("table");
    			tbody = element("tbody");
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(/*placeNumber*/ ctx[1]);
    			t1 = space();
    			td1 = element("td");
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(/*teamName*/ ctx[4]);
    			t5 = space();
    			div0 = element("div");
    			t6 = text(/*owner*/ ctx[5]);
    			t7 = space();
    			td3 = element("td");
    			t8 = text(t8_value);
    			br = element("br");
    			t9 = space();
    			if (if_block) if_block.c();
    			attr_dev(td0, "class", "standings-place-number svelte-iodfys");
    			attr_dev(td0, "width", "20");
    			add_location(td0, file$6, 29, 6, 710);
    			attr_dev(span, "class", span_class_value = "team-total-payout " + (/*teamTotalPayout*/ ctx[7] < 0 ? "negative" : "") + " svelte-iodfys");
    			add_location(span, file$6, 31, 7, 817);
    			attr_dev(td1, "width", "40");
    			attr_dev(td1, "align", "left");
    			add_location(td1, file$6, 30, 6, 781);
    			attr_dev(div0, "class", div0_class_value = "owner" + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-iodfys");
    			add_location(div0, file$6, 35, 7, 1034);
    			attr_dev(td2, "class", td2_class_value = "team-name" + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-iodfys");
    			add_location(td2, file$6, 33, 6, 955);
    			add_location(br, file$6, 38, 50, 1224);
    			attr_dev(td3, "class", td3_class_value = "team-earnings" + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-iodfys");
    			add_location(td3, file$6, 37, 6, 1116);
    			add_location(tr, file$6, 28, 5, 699);
    			add_location(tbody, file$6, 27, 4, 686);
    			attr_dev(table, "border", "0");
    			attr_dev(table, "width", "100%");
    			add_location(table, file$6, 26, 3, 650);
    			attr_dev(div1, "class", "header svelte-iodfys");
    			add_location(div1, file$6, 25, 2, 626);
    			attr_dev(div2, "class", "team svelte-iodfys");
    			add_location(div2, file$6, 24, 1, 581);
    			attr_dev(div3, "class", "team svelte-iodfys");
    			add_location(div3, file$6, 23, 0, 561);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, tbody);
    			append_dev(tbody, tr);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, span);
    			append_dev(span, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(td2, t5);
    			append_dev(td2, div0);
    			append_dev(div0, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td3);
    			append_dev(td3, t8);
    			append_dev(td3, br);
    			append_dev(div2, t9);
    			if (if_block) if_block.m(div2, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(div2, "click", /*toggleRoster*/ ctx[8], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*placeNumber*/ 2) set_data_dev(t0, /*placeNumber*/ ctx[1]);

    			if (!current || dirty & /*isFavorite*/ 4 && div0_class_value !== (div0_class_value = "owner" + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-iodfys")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*isFavorite*/ 4 && td2_class_value !== (td2_class_value = "team-name" + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-iodfys")) {
    				attr_dev(td2, "class", td2_class_value);
    			}

    			if (!current || dirty & /*isFavorite*/ 4 && td3_class_value !== (td3_class_value = "team-earnings" + (/*isFavorite*/ ctx[2] ? " favorite" : "") + " svelte-iodfys")) {
    				attr_dev(td3, "class", td3_class_value);
    			}

    			if (/*rosterVisible*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*rosterVisible*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { team } = $$props, { placeNumber } = $$props, { isFavorite } = $$props;
    	let teamName = team.gsx$teamname.$t;
    	let owner = team.gsx$owner.$t;
    	let teamTotalEarnings = team.gsx$teamtotalearnings.$t;
    	let teamTotalPayout = team.gsx$teampayout.$t;
    	let rosterVisible = false;

    	function toggleRoster() {
    		$$invalidate(3, rosterVisible = !rosterVisible);

    		if (rosterVisible) {
    			ga("send", {
    				hitType: "event",
    				eventCategory: "Overall",
    				eventAction: "Click Team",
    				eventLabel: teamName
    			});
    		}
    	}

    	const writable_props = ["team", "placeNumber", "isFavorite"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<OverallTeam> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("OverallTeam", $$slots, []);

    	$$self.$set = $$props => {
    		if ("team" in $$props) $$invalidate(0, team = $$props.team);
    		if ("placeNumber" in $$props) $$invalidate(1, placeNumber = $$props.placeNumber);
    		if ("isFavorite" in $$props) $$invalidate(2, isFavorite = $$props.isFavorite);
    	};

    	$$self.$capture_state = () => ({
    		OverallRoster,
    		team,
    		placeNumber,
    		isFavorite,
    		teamName,
    		owner,
    		teamTotalEarnings,
    		teamTotalPayout,
    		rosterVisible,
    		toggleRoster
    	});

    	$$self.$inject_state = $$props => {
    		if ("team" in $$props) $$invalidate(0, team = $$props.team);
    		if ("placeNumber" in $$props) $$invalidate(1, placeNumber = $$props.placeNumber);
    		if ("isFavorite" in $$props) $$invalidate(2, isFavorite = $$props.isFavorite);
    		if ("teamName" in $$props) $$invalidate(4, teamName = $$props.teamName);
    		if ("owner" in $$props) $$invalidate(5, owner = $$props.owner);
    		if ("teamTotalEarnings" in $$props) $$invalidate(6, teamTotalEarnings = $$props.teamTotalEarnings);
    		if ("teamTotalPayout" in $$props) $$invalidate(7, teamTotalPayout = $$props.teamTotalPayout);
    		if ("rosterVisible" in $$props) $$invalidate(3, rosterVisible = $$props.rosterVisible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		team,
    		placeNumber,
    		isFavorite,
    		rosterVisible,
    		teamName,
    		owner,
    		teamTotalEarnings,
    		teamTotalPayout,
    		toggleRoster
    	];
    }

    class OverallTeam extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { team: 0, placeNumber: 1, isFavorite: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverallTeam",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*team*/ ctx[0] === undefined && !("team" in props)) {
    			console.warn("<OverallTeam> was created without expected prop 'team'");
    		}

    		if (/*placeNumber*/ ctx[1] === undefined && !("placeNumber" in props)) {
    			console.warn("<OverallTeam> was created without expected prop 'placeNumber'");
    		}

    		if (/*isFavorite*/ ctx[2] === undefined && !("isFavorite" in props)) {
    			console.warn("<OverallTeam> was created without expected prop 'isFavorite'");
    		}
    	}

    	get team() {
    		throw new Error("<OverallTeam>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set team(value) {
    		throw new Error("<OverallTeam>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeNumber() {
    		throw new Error("<OverallTeam>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeNumber(value) {
    		throw new Error("<OverallTeam>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFavorite() {
    		throw new Error("<OverallTeam>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFavorite(value) {
    		throw new Error("<OverallTeam>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Overall.svelte generated by Svelte v3.21.0 */
    const file$7 = "src/Overall.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (67:1) {:else}
    function create_else_block_1$1(ctx) {
    	let img;
    	let img_src_value;
    	let span;

    	const block = {
    		c: function create() {
    			img = element("img");
    			span = element("span");
    			span.textContent = " Loading overall standings";
    			attr_dev(img, "class", "sheets-icon");
    			if (img.src !== (img_src_value = "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$7, 67, 2, 2181);
    			add_location(span, file$7, 67, 114, 2293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(67:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:1) {#if overall}
    function create_if_block$4(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*overall*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*overall, favoriteTeam, setFavorite*/ 7) {
    				each_value = /*overall*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(47:1) {#if overall}",
    		ctx
    	});

    	return block;
    }

    // (55:6) {:else}
    function create_else_block$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "♡";
    			set_style(span, "font-size", "13px");
    			set_style(span, "color", "#969494");
    			add_location(span, file$7, 55, 7, 1908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(55:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:6) {#if favoriteTeam === team.gsx$team.$t}
    function create_if_block_1$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "❤️";
    			set_style(span, "font-size", "10px");
    			add_location(span, file$7, 53, 7, 1846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(53:6) {#if favoriteTeam === team.gsx$team.$t}",
    		ctx
    	});

    	return block;
    }

    // (48:2) {#each overall as team, i}
    function create_each_block$5(ctx) {
    	let table;
    	let tr;
    	let td0;
    	let span;
    	let t0;
    	let td1;
    	let t1;
    	let current;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*favoriteTeam*/ ctx[1] === /*team*/ ctx[4].gsx$team.$t) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const overallteam = new OverallTeam({
    			props: {
    				team: /*team*/ ctx[4],
    				placeNumber: /*i*/ ctx[6] + 1,
    				isFavorite: /*favoriteTeam*/ ctx[1] === /*team*/ ctx[4].gsx$team.$t
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");
    			td0 = element("td");
    			span = element("span");
    			if_block.c();
    			t0 = space();
    			td1 = element("td");
    			create_component(overallteam.$$.fragment);
    			t1 = space();
    			attr_dev(span, "class", "favorite-button");
    			add_location(span, file$7, 51, 6, 1721);
    			attr_dev(td0, "class", "favorite-cell svelte-ed6l2r");
    			attr_dev(td0, "width", "30");
    			add_location(td0, file$7, 50, 5, 1677);
    			add_location(td1, file$7, 59, 5, 2006);
    			add_location(tr, file$7, 49, 4, 1667);
    			attr_dev(table, "class", "team svelte-ed6l2r");
    			attr_dev(table, "width", "100%");
    			attr_dev(table, "border", "0");
    			add_location(table, file$7, 48, 3, 1618);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, td0);
    			append_dev(td0, span);
    			if_block.m(span, null);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			mount_component(overallteam, td1, null);
    			append_dev(table, t1);
    			current = true;
    			if (remount) dispose();

    			dispose = listen_dev(
    				span,
    				"click",
    				function () {
    					if (is_function(/*setFavorite*/ ctx[2](/*team*/ ctx[4].gsx$team.$t))) /*setFavorite*/ ctx[2](/*team*/ ctx[4].gsx$team.$t).apply(this, arguments);
    				},
    				false,
    				false,
    				false
    			);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}

    			const overallteam_changes = {};
    			if (dirty & /*overall*/ 1) overallteam_changes.team = /*team*/ ctx[4];
    			if (dirty & /*favoriteTeam, overall*/ 3) overallteam_changes.isFavorite = /*favoriteTeam*/ ctx[1] === /*team*/ ctx[4].gsx$team.$t;
    			overallteam.$set(overallteam_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overallteam.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overallteam.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if_block.d();
    			destroy_component(overallteam);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(48:2) {#each overall as team, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*overall*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "teams");
    			add_location(div, file$7, 45, 0, 1551);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let overall, favoriteTeam;

    	onMount(async () => {
    		$$invalidate(0, overall = await getOverallStandings());

    		if (document.cookie.split("; ").find(row => row.startsWith("favoriteTeam"))) {
    			$$invalidate(1, favoriteTeam = document.cookie.split("; ").find(row => row.startsWith("favoriteTeam")).split("=")[1]);
    		} else {
    			$$invalidate(1, favoriteTeam = "");
    		}
    	});

    	function setFavorite(message) {
    		document.cookie = "favoriteTeam=" + message;
    		$$invalidate(1, favoriteTeam = message);

    		ga("send", {
    			hitType: "event",
    			eventCategory: "Weekly",
    			eventAction: "Favorite",
    			eventLabel: teamName
    		});
    	}

    	const getOverallStandings = async () => {
    		// const response = await fetch(`https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/3/public/full?alt=json`)
    		const response = await fetch(`https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/overall?timestamp=` + Date.now());

    		const data = await response.json();
    		const teams = data.feed.entry.filter(row => row.gsx$teamname.$t != "");

    		teams.forEach(team => {
    			team.roster = [];

    			data.feed.entry.forEach(player => {
    				if (player.gsx$team.$t == team.gsx$team.$t) {
    					team.roster.push(player);
    				}
    			});
    		});

    		const sortedTeams = teams.sort((a, b) => {
    			return numeral(a.gsx$teamtotalearnings.$t).value() > numeral(b.gsx$teamtotalearnings.$t).value()
    			? -1
    			: numeral(a.gsx$teamtotalearnings.$t).value() < numeral(b.gsx$teamtotalearnings.$t).value()
    				? 1
    				: 0;
    		});

    		return sortedTeams;
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Overall> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Overall", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		OverallTeam,
    		overall,
    		favoriteTeam,
    		setFavorite,
    		getOverallStandings
    	});

    	$$self.$inject_state = $$props => {
    		if ("overall" in $$props) $$invalidate(0, overall = $$props.overall);
    		if ("favoriteTeam" in $$props) $$invalidate(1, favoriteTeam = $$props.favoriteTeam);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [overall, favoriteTeam, setFavorite];
    }

    class Overall extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overall",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.21.0 */
    const file$8 = "src/App.svelte";

    // (17:37) 
    function create_if_block_1$2(ctx) {
    	let current;
    	const overall = new Overall({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(overall.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overall, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overall.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overall.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overall, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(17:37) ",
    		ctx
    	});

    	return block;
    }

    // (14:1) {#if currentPage === "Weekly"}
    function create_if_block$5(ctx) {
    	let current;
    	const weekly = new Weekly({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(weekly.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(weekly, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(weekly.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(weekly.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(weekly, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(14:1) {#if currentPage === \\\"Weekly\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let updating_activePage;
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	function picker_activePage_binding(value) {
    		/*picker_activePage_binding*/ ctx[2].call(null, value);
    	}

    	let picker_props = { pages: /*pages*/ ctx[1] };

    	if (/*currentPage*/ ctx[0] !== void 0) {
    		picker_props.activePage = /*currentPage*/ ctx[0];
    	}

    	const picker = new Picker({ props: picker_props, $$inline: true });
    	binding_callbacks.push(() => bind(picker, "activePage", picker_activePage_binding));
    	const if_block_creators = [create_if_block$5, create_if_block_1$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*currentPage*/ ctx[0] === "Weekly") return 0;
    		if (/*currentPage*/ ctx[0] === "Overall") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(picker.$$.fragment);
    			t0 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			if (if_block) if_block.c();
    			add_location(br0, file$8, 12, 1, 310);
    			add_location(br1, file$8, 12, 5, 314);
    			attr_dev(div, "id", "main");
    			attr_dev(div, "class", "svelte-cv1fkz");
    			add_location(div, file$8, 10, 0, 237);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(picker, div, null);
    			append_dev(div, t0);
    			append_dev(div, br0);
    			append_dev(div, br1);
    			append_dev(div, t1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const picker_changes = {};

    			if (!updating_activePage && dirty & /*currentPage*/ 1) {
    				updating_activePage = true;
    				picker_changes.activePage = /*currentPage*/ ctx[0];
    				add_flush_callback(() => updating_activePage = false);
    			}

    			picker.$set(picker_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(picker.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(picker.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(picker);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let pages = ["Weekly", "Overall"];
    	let currentPage = "Weekly";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function picker_activePage_binding(value) {
    		currentPage = value;
    		$$invalidate(0, currentPage);
    	}

    	$$self.$capture_state = () => ({
    		Picker,
    		Weekly,
    		Overall,
    		onMount,
    		pages,
    		currentPage
    	});

    	$$self.$inject_state = $$props => {
    		if ("pages" in $$props) $$invalidate(1, pages = $$props.pages);
    		if ("currentPage" in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentPage, pages, picker_activePage_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
